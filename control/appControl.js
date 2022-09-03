const mongoose = require("mongoose");
const Vote = require("../models/vote");
const User = require("../models/users");
const Election = require("../models/election");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const getOpenElection = async (req, res) => {
  const { department, status } = req.query;
  const parameter = {};
  if (department) {
    parameter.department = department;
  }
  if (status) {
    parameter.status = status;
  }
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

  try {
    const user = await User.signup(
      name,
      email,
      department,
      userImage,
      password
    );
    const token = createToken(user._id);

    res
      .status(200)
      .json({ name, email, department, userImage, token, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ user, token, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { name, email, department, userImage, id } = req.body;
  console.log(name);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: id },
    { name: name, email: email, department: department, userImage: userImage }
  );

  if (!updatedUser) {
    return res.status(400).json({ error: "no such user" });
  }
  res.status(200).json(updatedUser);
  console.log(updatedUser);
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const newPassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    if (!id || !password) {
      throw Error("all field must be filled");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate({ _id: id }, { password: hash });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserVote = async (req, res) => {
  const { id } = req.params;
  const votes = await Vote.find({ userId: id });
  if (votes.length === 0) {
    res.status(200).json("You have not vote yet!");
  } else {
    const electionId = votes.map((vote) => {
      return { _id: vote.electionId };
    });
    const election = await Election.find({ _id: { $in: electionId } });
    res.status(200).json({ votes, election });
  }
};

module.exports = {
  getOpenElection,
  postVote,
  signupUser,
  loginUser,
  updateUser,
  changePassword,
  newPassword,
  getUserVote,
};
