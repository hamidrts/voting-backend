const mongoose = require("mongoose");
const Vote = require("../models/vote");
const User = require("../models/users");
const Election = require("../models/election");
const jwt = require("jsonwebtoken");

const getOpenElection = async (req, res) => {
  const { department, status } = req.query;
  const parameter = {};
  if (department) {
    parameter.department = department;
  }
  if (status) {
    parameter.status = status;
  }
  console.log(parameter);
  const elections = await Election.find(parameter);
  res.status(200).json(elections);
};

const postVote = async (req, res) => {
  const { userId, electionId, candidateId } = req.body;
  const [checkUserVoteNumber] = await Vote.find({ userId, electionId });
  console.log(checkUserVoteNumber);
  if (checkUserVoteNumber) {
    res.status(401).json({ error: "You have already vote" });
  } else {
    try {
      const vote = await Vote.create({ userId, electionId, candidateId });
      res.status(200).json(vote);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { name, email, department, userImage, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.signup(
      name,
      email,
      department,
      userImage,
      password
    );
    const token = createToken(user._id);
    console.log(user);
    res
      .status(200)
      .json({ name, email, department, userImage, token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    console.log(user);

    res.status(200).json({ user, token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getOpenElection,
  postVote,
  signupUser,
  loginUser,
};
