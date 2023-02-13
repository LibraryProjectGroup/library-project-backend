import { Request, Response, Router } from "express";
import { Client, generators, Issuer } from "openid-client";
import {
  getChallengeVerificationCodeByCodeParameter,
  getOidcIssuerDataById,
  getOidcIssuerDataByName,
  storeChallenge,
} from "../../../queries/session";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import { queryOrRegisterOidcUser } from "../../../queries/user";
import { createSession } from "../../auth";
import { OidcIssuer, OidcIssuerId } from "../../../interfaces/OidcIssuer";

const router = Router();

const TEMP_COOKIE_NAME = "Efi-OIDC-Session";
// e.g. `http://localhost:3000`, this becomes `http://localhost:3000/login`.
const OIDC_AUTH_BACKLINK_URL = process.env.OIDC_AUTH_BACKLINK_URL;
// e.g. `http://localhost:3002/auth/oidc/callback`
const OIDC_AUTH_REDIRECT_URL = process.env.OIDC_AUTH_REDIRECT_URL;

(function () {
  if (!OIDC_AUTH_BACKLINK_URL) {
    throw new Error("No OIDC backlink URL specified in environment");
  }

  if (!OIDC_AUTH_REDIRECT_URL) {
    throw new Error("No OIDC redirect URL specified in environment");
  }
})();

async function resolveAndDiscoverIssuerByName(
  issuerName: string
): Promise<{ issuerData: OidcIssuer; issuer: Issuer }> {
  const issuerData = await getOidcIssuerDataByName(issuerName);
  if (!issuerData) {
    throw new Error(`No issuer named '${issuerName}' found`);
  }
  return {
    issuerData: issuerData,
    issuer: await Issuer.discover(issuerData.wellKnownDomain),
  };
}

async function resolveAndDiscoverIssuerById(
  issuerId: OidcIssuerId
): Promise<{ issuerData: OidcIssuer; issuer: Issuer }> {
  const issuerData = await getOidcIssuerDataById(issuerId);
  if (!issuerData) {
    throw new Error(`No issuer with id '${issuerId}' found`);
  }
  return {
    issuerData: issuerData,
    issuer: await Issuer.discover(issuerData.wellKnownDomain),
  };
}

async function createAuthClientByName(
  issuerName: string
): Promise<{ client: Client; issuerData: OidcIssuer }> {
  const { issuer: clientIssuer, issuerData } =
    await resolveAndDiscoverIssuerByName(issuerName);
  return {
    issuerData: issuerData,
    client: new clientIssuer.Client({
      client_id: issuerData.clientId,
      client_secret: issuerData.clientSecret,
      redirect_uris: [OIDC_AUTH_REDIRECT_URL!!],
      response_types: ["code"],
      id_token_signed_response_alg: "RS256",
      token_endpoint_auth_method: "client_secret_basic",
    }),
  };
}

async function createAuthClientById(
  issuerId: OidcIssuerId
): Promise<{ client: Client; issuerData: OidcIssuer }> {
  const { issuer: clientIssuer, issuerData } =
    await resolveAndDiscoverIssuerById(issuerId);
  return {
    issuerData: issuerData,
    client: new clientIssuer.Client({
      client_id: issuerData.clientId,
      client_secret: issuerData.clientSecret,
      redirect_uris: [OIDC_AUTH_REDIRECT_URL!!],
      response_types: ["code"],
      id_token_signed_response_alg: "RS256",
      token_endpoint_auth_method: "client_secret_basic",
    }),
  };
}

router.get(
  "/callback",
  async (req: Request<{}, {}, {}, { code: string }>, res: Response) => {
    // ?code query parameter
    const authId = req.cookies[TEMP_COOKIE_NAME];
    const { code } = req.query;
    if (!authId || !code) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }

    const challengeData = await getChallengeVerificationCodeByCodeParameter(
      authId
    );

    if (!challengeData) {
      // Verification code was not put in to the database on /login or was already removed
      res.sendStatus(StatusCodes.PRECONDITION_FAILED);
      return;
    }

    const { client } = await createAuthClientById(challengeData.oidcIssuerId);
    const tokenSet = await client.callback(
      "http://localhost:3002",
      { code: code },
      { code_verifier: challengeData.verificationCode }
    );
    console.log("received and validated tokens %j", tokenSet);
    const tokenClaims = tokenSet.claims();
    console.log("validated ID Token claims %j", tokenClaims);

    const { iss, email, name, sub } = tokenClaims;

    if (!iss || !email || !name || !sub) {
      // Extract only the claims we really need for useful debugging
      const errorObject = (({ iss, email, name, sub }) => ({
        iss,
        email,
        name,
        sub,
      }))(tokenClaims);
      throw new Error("Claims are missing from id token: " + errorObject);
    }

    const user = await queryOrRegisterOidcUser(
      challengeData.oidcIssuerId,
      sub,
      name,
      email
    );

    if (!user) {
      // TODO Better error message
      throw new Error("Something went wrong during authentication");
    }

    const session = await createSession(user.id);

    if (!session) {
      // TODO Better error message
      throw new Error("Something went wrong during authentication");
    }

    // Only clear it at the end, when someone navigates to /login it gets overwritten anyway.
    res.clearCookie(TEMP_COOKIE_NAME);

    res.redirect(
      StatusCodes.TEMPORARY_REDIRECT,
      `${OIDC_AUTH_BACKLINK_URL}/login?user=${encodeURIComponent(
        user.id
      )}&secret=${encodeURIComponent(session.secret)}`
    );
  }
);

router.get(
  "/login",
  async (req: Request<{}, {}, {}, { issuer: string }>, res: Response) => {
    const { issuer: issuerName } = req.query;
    if (!issuerName) {
      throw new Error("No OIDC issuer specified in request");
    }

    const { client, issuerData } = await createAuthClientByName(issuerName);

    // Secret code stored in backend (used later to verify public code)
    const codeVerifier = generators.codeVerifier();
    // Public challenge code
    const codeChallenge = generators.codeChallenge(codeVerifier);
    // Stored in a cookie to couple the (secret) verification code in the database
    const authId = randomBytes(20).toString("hex");

    await storeChallenge(authId, codeVerifier, issuerData.databaseId);

    const url = client.authorizationUrl({
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    res.cookie(TEMP_COOKIE_NAME, authId, { httpOnly: true });

    res.redirect(StatusCodes.TEMPORARY_REDIRECT, url);
  }
);

export default router;
