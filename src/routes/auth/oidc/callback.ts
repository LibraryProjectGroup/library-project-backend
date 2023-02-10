import { Request, Response, Router } from "express";
import { resolveGoogleIssuer } from "./google";
import { Client, generators } from "openid-client";
import {
  getChallengeVerificationCodeByCodeParameter,
  storeChallenge,
} from "../../../queries/session";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import { queryOrRegisterOidcUser } from "../../../queries/user";
import { createSession } from "../../auth";

const router = Router();

const TEMP_COOKIE_NAME = "Efi-OIDC-Session";

async function createAuthClient(): Promise<Client> {
  const clientIssuer = await resolveGoogleIssuer();
  return new clientIssuer.Client({
    client_id: "ZbMX1RUMbOSlfFfSt50irU0MrJWZkDY5",
    client_secret:
      "pIcCNKA5b8U04k233pVcx0pHafwalrcFo0KM9M4voZjJzKsbFzVMvitbAUmG9NH7",
    redirect_uris: ["http://localhost:3002/auth/oidc/callback"],
    response_types: ["code"],
    id_token_signed_response_alg: "RS256",
    token_endpoint_auth_method: "client_secret_basic",
  });
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

    const clientIssuer = await createAuthClient();
    const tokenSet = await clientIssuer.callback(
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

    const user = await queryOrRegisterOidcUser("google", sub, name, email);

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
      `http://localhost:3000/login?user=${encodeURIComponent(
        user.id
      )}&secret=${encodeURIComponent(session.secret)}`
    );
  }
);

router.get("/login", async (req: Request, res: Response) => {
  // Secret code stored in backend (used later to verify public code)
  const codeVerifier = generators.codeVerifier();

  // Public challenge code
  const codeChallenge = generators.codeChallenge(codeVerifier);

  // Stored in a cookie to couple the (secret) verification code in the database
  const authId = randomBytes(20).toString("hex");

  await storeChallenge(authId, codeVerifier);

  const client = await createAuthClient();

  const url = client.authorizationUrl({
    scope: "openid email profile",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.cookie(TEMP_COOKIE_NAME, authId, { httpOnly: true });

  res.redirect(StatusCodes.TEMPORARY_REDIRECT, url);
});

export default router;
