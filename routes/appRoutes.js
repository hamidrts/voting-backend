const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuthUser");

const {
  getOpenElection,
  postVote,
  loginUser,
  signupUser,
  updateUser,
  changePassword,
  newPassword,
  getUserVote,
} = require("../control/appControl");

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.get("/", getOpenElection);

router.use(requireAuth);

router.post("/submitvote", postVote);

router.patch("/updateprofile", updateUser);

router.post("/changepassword", changePassword);

router.patch("/newpassword", newPassword);

router.get("/:id", getUserVote);

module.exports = router;
