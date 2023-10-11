const User = require("../models/user.model");
const {
  createJWT,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/password");
const {
  generateFileStorageSasToken,
  generateBlobStorageSasToken,
} = require("../config/azureFile");

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ error: "Email not found" });
    }
    // User is authenticated, so proceed with generating tokens
    const idToken = createJWT({
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      authTime: new Date().toISOString(),
    });

    // Check the password
    const checkPassword = await comparePassword(password, user.password);

    if (!checkPassword) {
      return response.status(401).json({ error: "Invalid password" });
    }

    // Generate the refresh token
    const refreshToken = generateRefreshToken(user.uid);

    // Update the user's refreshToken, idToken, and signedIn fields
    user.refreshToken = refreshToken;
    user.idToken = idToken;
    user.signedIn = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    // Save the updated user object in the database
    await user.save();
    return response.status(200).json({
      _id: user._id,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken,
      refreshToken,
      expiresIn: 3600,
      photoUrl: user.photoUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    return response
      .status(error.statusCode || 500)
      .json({ error: error.message });
  }
};

const handelRefreshToken = async (request, response) => {
  try {
    // eslint-disable-next-line no-shadow
    let { refreshToken } = request.body;

    // Check if the refresh token is exists or not
    const user = await User.findOne({ refreshToken });

    // Check if the refresh token is valid, else return an error
    const decoded = verifyRefreshToken(refreshToken);

    // Return the error response for an invalid token
    if (!decoded || !user) {
      return response.status(401).json({ error: "Invalid refresh token" });
    }

    // Generate a new ID token
    const idToken = createJWT({
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      authTime: user.signedIn,
    });

    // Generate the refresh token
    refreshToken = generateRefreshToken(user.uid);

    // Update the user's refreshToken, idToken, and signedIn fields
    user.refreshToken = refreshToken;
    user.idToken = idToken;
    user.updatedAt = new Date().toISOString();

    // Save the updated user object in the database
    await user.save();

    // Return data
    return response.status(200).json({
      id: user._id,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken,
      refreshToken,
      expiresIn: 3600,
      photoUrl: user.photoUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    return response
      .status(error.statusCode || 500)
      .json({ error: error.message });
  }
};

const changePassword = async (request, response) => {
  try {
    const { password, newPassword } = request.body;

    // get email form the middleware
    const { email } = request.decodedToken;

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Check the password
    const checkPassword = await comparePassword(password, user.password);

    if (!checkPassword) {
      return response.status(401).json({ error: "Invalid password" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();

    await user.save();

    return response
      .status(200)
      .json({ message: "update password succesfully." });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

const generateSasToken = async (request, response) => {
  try {
    const fileStorageSasToken = generateFileStorageSasToken();
    const blobStorageSasToken = generateBlobStorageSasToken();

    const SasToken = {
      fileStorageSasToken,
      blobStorageSasToken,
    };

    return response.status(200).json(SasToken);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  handelRefreshToken,
  changePassword,
  generateSasToken,
};
