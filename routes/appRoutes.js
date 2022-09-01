const express = require("express");
const multer = require("multer");

const {
  getOpenElection,
  postVote,
  loginUser,
  signupUser,
  updateUser,
  changePassword,
  newPassword,
} = require("../control/appControl");

const router = express.Router();

router.get("/", getOpenElection);

router.post("/submitvote", postVote);

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.patch("/updateprofile", updateUser);

router.post("/changepassword", changePassword);

router.patch("/newpassword", newPassword);

module.exports = router;
