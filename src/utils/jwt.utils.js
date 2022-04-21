const { sign, SignOptions, verify, VerifyOptions } = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

/**
 * generates JWT used for local testing
 */
function generateToken(payload) {
  // read private key value
  const privateKey = fs.readFileSync(path.join(__dirname, '../../private.key'));

  const signInOptions = {
    // RS256 uses a public/private key pair. The API provides the private key 
    // to generate the JWT. The client gets a public key to validate the 
    // signature
    algorithm: 'RS256',
    expiresIn: '1h'
  };

  // generate JWT
  return sign(payload, privateKey, signInOptions);
};

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
function validateToken(token) {
  const publicKey = fs.readFileSync(path.join(__dirname, '../../public.key'));

  const verifyOptions = {
    algorithms: ['RS256'],
  };

  return new Promise((resolve, reject) => {
    verify(token, publicKey, verifyOptions, (error, decoded) => {
      if (error) return reject(error);

      resolve(decoded);
    })
  });
}

exports.generateToken = generateToken
exports.validateToken = validateToken
