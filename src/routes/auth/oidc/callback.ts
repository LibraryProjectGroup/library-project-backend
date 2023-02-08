import { Request, Response, Router } from "express";
import { resolveGoogleIssuer } from "./google";
import { Client, generators } from "openid-client";
import {
  getChallengeVerificationCodeByCodeParameter,
  storeChallenge,
} from "../../../queries/session";
import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import auth from "../../auth";

const router = Router();

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

router.get("/test/issuer", async (req: Request, res: Response) => {
  await resolveGoogleIssuer();
  res.json({}).status(200);
});

router.get(
  "/callback",
  async (req: Request<{}, {}, {}, { code: string }>, res: Response) => {
    // ?code query parameter
    const authId = req.cookies["Efi-OIDC-Sess"];
    const { code } = req.query;
    if (!authId || !code) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
    } else {
      const challengeData = await getChallengeVerificationCodeByCodeParameter(
        authId
      );

      if (!challengeData) {
        // Verification code was not put in to database on /login or was already removed
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
      console.log("validated ID Token claims %j", tokenSet.claims());
      res.clearCookie("Efi-OIDC-Sess");
    }
  }
);

router.get("/login", async (req: Request, res: Response) => {
  // Secret code stored in backend (used later to verify public code)
  const code_verifier = generators.codeVerifier();

  // Public challenge code
  const code_challenge = generators.codeChallenge(code_verifier);

  const authId = randomBytes(20).toString("hex");

  await storeChallenge(authId, code_verifier);

  const client = await createAuthClient();

  const url = client.authorizationUrl({
    scope: "openid email profile",
    // resource: "https://my.api.example.com/resource/32178",
    code_challenge,
    code_challenge_method: "S256",
  });

  res.cookie("Efi-OIDC-Sess", authId, { httpOnly: true });

  res.redirect(StatusCodes.TEMPORARY_REDIRECT, url);
});

export default router;
