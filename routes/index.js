const express = require("express");

const router = express.Router();

router.get("/", async (_, response) => {
  try {
    return response.status(200).json({
      message: "success",
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

module.exports = router;
