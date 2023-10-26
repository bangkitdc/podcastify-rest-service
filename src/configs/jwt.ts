const DEFAULT_SECRET_KEY = 'podcastify_default_access_secret_key';
const DEFAULT_TIME_EXPIRATION = 3600; // 1 hour

const jwtSecretKey =
  (process.env.JWT_SECRET_KEY as string) || DEFAULT_SECRET_KEY;

const jwtTimeExpirationString = process.env.JWT_TIME_EXPIRATION;
const jwtTimeExpiration = jwtTimeExpirationString
  ? parseInt(jwtTimeExpirationString, 10)
  : DEFAULT_TIME_EXPIRATION;

export { jwtSecretKey, jwtTimeExpiration };
