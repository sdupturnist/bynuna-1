// utils/hash.js

import crypto from 'crypto';

// Server-side hashing function (using Node's crypto module)
export function hashData(data, secretKey) {
  const hash = crypto.createHmac('sha256', secretKey); // Create HMAC using SHA-256 and secret key
  hash.update(data); // Update the hash with the data
  return hash.digest('hex'); // Return the hash as a hex string
}
