const express = require("express");

const { getNominate, postVote } = require("../control/homeControl");

const router = express.Router();

router.get("/", getNominate);

router.post("/", postVote);

module.exports = router;
