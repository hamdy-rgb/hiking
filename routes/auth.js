const express = require("express");
const { adminAuthorization } = require("../middleware/authorize");

const router = express.Router();
const {
  login,
  handelRefreshToken,
  generateSasToken,
} = require("../controllers/auth.controller");

router.post("/login", login); // Admin login route
router.post("/refresh-token", handelRefreshToken); // Refresh token route
router.get("/generate-sas-token", adminAuthorization, generateSasToken); // Generate SAS token

module.exports = router;
