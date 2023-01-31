const express = require("express");
const { handleGenerateNewShortURL } = require("../controllers/url");
const router = express.Router();

router.post("/g",  handleGenerateNewShortURL);

module.exports = router;
