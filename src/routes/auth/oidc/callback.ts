import { Request, Response, Router } from "express";
import { Client, generators, Issuer } from "openid-client";
import {
  getChallengeVerificationCodeByCodeParameter,
  getOidcIssuerDataById,
  storeOidcChallenge,
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
// e.g. `http://localhost:3002`
const OIDC_AUTH_REDIRECT_URL = process.env.OIDC_AUTH_REDIRECT_URL;

(function () {
  if (!OIDC_AUTH_BACKLINK_URL) {
    throw new Error("No OIDC backlink URL specified in environment");
  }

  if (!OIDC_AUTH_REDIRECT_URL) {
    throw new Error("No OIDC redirect URL specified in environment");
  }
})();

async function resolveAndDiscoverIssuerById(
  issuerId: OidcIssuerId
): Promise<{ issuerData: OidcIssuer; issuer: Issuer }> {
  const issuerData = await getOidcIssuerDataById(issuerId);
  if (!issuerData) {
    throw new Error(`No issuer with id '${issuerId}' found`);
  }
  return {
    issuerData: issuerData,
    // This line makes a network request to the .well-known OIDC information endpoint
    issuer: await Issuer.discover(issuerData.wellKnownDomain),
  };
}

async function createAuthClientById(
  issuerId: OidcIssuerId
): Promise<{ client: Client; issuerData: OidcIssuer }> {
  const { issuer: clientIssuer, issuerData } =
    await resolveAndDiscoverIssuerById(issuerId);
  const redirectUri = `${OIDC_AUTH_REDIRECT_URL!!}/auth/oidc/callback`;
  return {
    issuerData: issuerData,
    client: new clientIssuer.Client({
      client_id: issuerData.clientId,
      client_secret: issuerData.clientSecret,
      redirect_uris: [redirectUri],
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
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const { client } = await createAuthClientById(challengeData.oidcIssuerId);
    const tokenSet = await client.callback(
      OIDC_AUTH_REDIRECT_URL + "/auth/oidc/callback",
      { code: code },
      { code_verifier: challengeData.verificationCode }
    );
    const tokenClaims = tokenSet.claims();

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
      throw new Error(
        `Something went wrong during authentication, no registered library user for OIDC user profile ${challengeData.oidcIssuerId}`
      );
    }

    const session = await createSession(user.id);

    if (!session) {
      throw new Error(
        `Something went wrong during authentication, no session was created for user ${user.id}`
      );
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
    const { issuer: issuerId } = req.query;
    if (!issuerId) {
      throw new Error("No OIDC issuer specified in request");
    }

    const { client, issuerData } = await createAuthClientById(issuerId);

    // Secret code stored in backend (used later to verify public code)
    const codeVerifier = generators.codeVerifier();
    // Public challenge code
    const codeChallenge = generators.codeChallenge(codeVerifier);
    // Stored in a cookie to couple the (secret) verification code in the database
    const authId = randomBytes(20).toString("hex");

    await storeOidcChallenge(authId, codeVerifier, issuerData.databaseId);

    const url = client.authorizationUrl({
      scope: "openid email profile",
      code_challenge: codeChallenge,
      redirect_uri: OIDC_AUTH_REDIRECT_URL + "/auth/oidc/callback",
      code_challenge_method: "S256",
    });

    res.cookie(TEMP_COOKIE_NAME, authId, { httpOnly: true });

    res.redirect(StatusCodes.TEMPORARY_REDIRECT, url);
  }
);

export default router;
