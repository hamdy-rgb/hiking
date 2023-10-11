const User = require("../models/user.model");
const { verifyJWT } = require("../utils/jwt");

// Middleware for admin authorization
const adminAuthorization = async (request, response, next) => {
  try {
    // Extract the JWT token from the request headers
    const idToken = request.headers.authorization?.split("Bearer ")[1];

    // Check if the token is missing
    if (!idToken) {
      return response.status(401).json({ status: "UNAUTHORIZED_OPERATION" });
    }

    // Verify and decode the JWT token
    const decodedToken = verifyJWT(idToken);

    // Check if token verification failed
    if (!decodedToken) {
      return response.status(401).json({ status: "UNAUTHORIZED_OPERATION" });
    }

    // Extract the user's unique ID from the decoded token
    const { id } = decodedToken;

    // Find the user in the database based on the UID
    const user = await User.findOne({ id });


    // If all checks pass, proceed to the next middleware or route
    return next();
  } catch (error) {
    // Handle any errors that occur during the process
    return response.status(401).json({ error: error.message });
  }
};

module.exports = {
  adminAuthorization,
};
