const express = require("express");

const {
  getVote,
  postNominate,
  deleteNominate,
  createElection,
  getElection,
  get3LastElection,
  updateElection,
} = require("../control/adminControl");

const router = express.Router();

router.get("/vote", getVote);

router.post("/", postNominate);

router.get("/", get3LastElection);

router.delete("/:id", deleteNominate);

router.post("/createElection", createElection);

router.get("/createElection/getelection", getElection);

router.patch("/:id", updateElection);

module.exports = router;
