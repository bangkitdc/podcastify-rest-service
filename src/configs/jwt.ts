const DEFAULT_ACCESS_TOKEN = 'podcastify_default_access_secret_key';
const DEFAULT_ACCESS_TOKEN_EXPIRATION = 60 * 15; // 15 minutes

const DEFAULT_REFRESH_TOKEN = 'podcastify_default_access_refresh_key';
const DEFAULT_REFRESH_TOKEN_EXPIRATION = 3600 * 24 * 7; // 7 days

const jwtAccessToken = (process.env.ACCESS_TOKEN_SCRET as string) || DEFAULT_ACCESS_TOKEN;

const jwtAccessTokenExpirationString = process.env.ACCESS_TOKEN_EXPIRATION;
const jwtAccessTokenExpiration = jwtAccessTokenExpirationString
  ? parseInt(jwtAccessTokenExpirationString, 10)
  : DEFAULT_ACCESS_TOKEN_EXPIRATION;

const jwtRefreshToken = (process.env.REFRESH_TOKEN_SCRET as string) || DEFAULT_REFRESH_TOKEN;

const jwtRefreshTokenExpirationString = process.env.REFRESH_TOKEN_EXPIRATION;
const jwtRefreshTokenExpiration = jwtRefreshTokenExpirationString
  ? parseInt(jwtRefreshTokenExpirationString, 10)
  : DEFAULT_REFRESH_TOKEN_EXPIRATION;

export { 
  jwtAccessToken, 
  jwtAccessTokenExpiration,

  jwtRefreshToken,
  jwtRefreshTokenExpiration
};
