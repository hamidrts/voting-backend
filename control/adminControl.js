const mongoose = require("mongoose");
const Vote = require("../models/vote");
const Admin = require("../models/Admin");
const Election = require("../models/election");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../upload/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const getVote = async (req, res) => {
  const votes = await Vote.find({});
  res.status(200).json(votes);
};

const deleteNominate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such nominate" });
  }

  const nominate = await Nominate.findByIdAndDelete({ _id: id });
  if (!nominate) {
    return res.status(404).json({ error: "no such nominate" });
  }
  res.status(200).json(nominate);
};

const createElection = async (req, res) => {
  const {
    department,
    electionName,
    term,
    startDate,
    finishDate,
    status,
    candidates,
  } = req.body;

  try {
    const election = await Election.create({
      department,
      electionName,
      term,
      startDate,
      finishDate,
      status,
      candidates,
    });

    res.status(200).json(election);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getElection = async (req, res) => {
  let parameter = {};
  let { department, term, status } = req.query;
  if (department) {
    parameter.department = department;
  }
  if (term) {
    parameter.term = term;
  }
  if (status) {
    parameter.status = status;
  }

  const election = await Election.find(parameter);
  return res.json(election);
};

const get3LastElection = async (req, res) => {
  try {
    const last3Election = await Election.find({})
      .sort({ updatedAt: -1 })
      .limit(3);
    res.status(200).json(last3Election);
  } catch (err) {
    res.status(400).json({ error: err.massage });
  }
};

const updateElection = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such election" });
  }

  const election = await Election.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  );

  if (!election) {
    return res.status(400).json({ error: "no such election" });
  }
  res.status(200).json(election);
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.signup(username, password);
    const token = createToken(admin._id);

    res.status(200).json({ username, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.login(username, password);
    const token = createToken(admin._id);

    res.status(200).json({ username, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const setResultAndClose = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such election" });
  }
  const election = req.body;

  let result = {};
  let electionVotes = [];
  let votes = await Vote.find({ electionId: id });
  let winnerVotes = 0;
  let winner = [];

  if (votes.length > 0) {
    election.candidates.forEach((element) => {
      let candidVotes = {};
      let voteCount = 0;
      votes.forEach((vote) => {
        if (vote.candidateId === element._id) {
          voteCount += 1;
        }
      });
      if (voteCount > winnerVotes) {
        winnerVotes = voteCount;
        winner = [];
        winner.push(element._id);
      } else if (voteCount === winnerVotes) {
        winner.push(element._id);
      }
      candidVotes.candid = element._id;
      candidVotes.votes = voteCount;
      electionVotes.push(candidVotes);
    });
  }
  result.votes = electionVotes;
  result.winner = winner;

  let closeedElection = await Election.findOneAndUpdate(
    { _id: election._id },
    { status: "close", result: result }
  );
  if (!closeedElection) {
    return res.status(400).json({ error: "no such election" });
  }
  res.status(200).json(closeedElection);
};

module.exports = {
  getVote,
  deleteNominate,
  createElection,
  getElection,
  get3LastElection,
  updateElection,
  loginAdmin,
  signupAdmin,
  setResultAndClose,
};
