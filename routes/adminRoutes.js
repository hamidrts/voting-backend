const express = require("express");

const {
  getVote,

  deleteNominate,
  createElection,
  getElection,
  get3LastElection,
  updateElection,
  loginAdmin,
  signupAdmin,
} = require("../control/adminControl");

const router = express.Router();

router.get("/vote", getVote);

router.get("/", get3LastElection);

router.delete("/:id", deleteNominate);

router.post("/createElection", createElection);

router.get("/createElection/getelection", getElection);

router.patch("/:id", updateElection);

router.post("/login", loginAdmin);

router.post("/signup", signupAdmin);

module.exports = router;
