const jwt = require('jsonwebtoken');

/**
 * Middleware function to verify JWT tokens.
 *
 * This middleware extracts the JWT token from the Authorization header,
 * verifies it using the secret key, and attaches the user ID to the request object.
 * It handles various error cases such as missing token, invalid format, invalid token,
 * and token expiration.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
const verifyToken = (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = tokenParts[1];

    // Verify the token using the JWT_SECRET from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        } else {
          return res.status(401).json({ message: 'Invalid token' });
        }
      }
      // Attach the user ID from the token payload to the request object
      req.user = { id: decoded.id };
      next();
    });

  } catch (error) {
    console.error('Error during token verification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { verifyToken };