import { Client, Issuer } from "openid-client";

export async function resolveGoogleIssuer(): Promise<Issuer<Client>> {
  const googleIssuer = await Issuer.discover(
    "https://efilibrary-test.eu.auth0.com"
  );
  return googleIssuer;
}
