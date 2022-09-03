const express = require("express");

const requireAuth = require("../middleware/requireAuthAdmin");

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
router.post("/login", loginAdmin);

router.post("/signup", signupAdmin);

router.use(requireAuth);

router.get("/vote", getVote);

router.get("/", get3LastElection);

router.delete("/:id", deleteNominate);

router.post("/createElection", createElection);

router.get("/createElection/getelection", getElection);

router.patch("/:id", updateElection);

module.exports = router;
