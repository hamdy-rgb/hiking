const fs = require("node:fs");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const keyId = uuidv4();

const PRIVATE_KEY_PATH = path.join(__dirname, process.env.PRIVATE_KEY_PATH);
const PUBLIC_KEY_PATH = path.join(__dirname, process.env.PUBLIC_KEY_PATH);
const { JWT_REFRESH_SECRET_KEY } = process.env;

const createJWT = ({ displayName, id, email, authTime }) => {
  try {
    const payload = {
      displayName,
      id,
      email,
      authTime,
    };

    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    const token = jwt.sign(payload, privateKey, {
      expiresIn: 3600,
      algorithm: "RS256",
      header: {
        kid: keyId,
      },
    });

    return token;
  } catch (error) {
    return null;
  }
};

const verifyJWT = (token, checkExpiration = true) => {
  try {
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });

    if (checkExpiration) {
      const isExpired = Date.now() >= decoded.exp * 1000;
      if (isExpired) {
        return null;
      }
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

const generateRefreshToken = (id) => {
  try {
    const payload = {
      sub: id,
      type: "refresh",
    };

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, {
      expiresIn: "90d",
    });

    return refreshToken;
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);

    if (decoded.type !== "refresh") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createJWT,
  verifyJWT,
  generateRefreshToken,
  verifyRefreshToken,
};
