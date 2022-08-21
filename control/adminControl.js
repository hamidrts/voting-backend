const mongoose = require("mongoose");
const Vote = require("../models/vote");
const Admin = require("../models/Admin");
const Election = require("../models/election");
const jwt = require("jsonwebtoken");

const getVote = async (req, res) => {
  const votes = await Vote.find({});
  res.status(200).json(votes);
  console.log("hey");
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

module.exports = {
  getVote,
  deleteNominate,
  createElection,
  getElection,
  get3LastElection,
  updateElection,
  loginAdmin,
  signupAdmin,
};
