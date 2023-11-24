export type OidcIssuerId = string | number

export interface OidcIssuer {
  databaseId: OidcIssuerId
  name: string
  wellKnownDomain: string
  clientId: string
  clientSecret: string
  metadata: Record<any, any>
}
