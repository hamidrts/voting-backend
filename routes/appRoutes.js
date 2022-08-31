const express = require("express");
const multer = require("multer");

const {
  getOpenElection,
  postVote,
  loginUser,
  signupUser,
} = require("../control/appControl");

const router = express.Router();

router.get("/", getOpenElection);

router.post("/submitvote", postVote);

router.post("/login", loginUser);

router.post("/signup", signupUser);

module.exports = router;
