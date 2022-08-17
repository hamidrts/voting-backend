const mongoose = require("mongoose");
const Vote = require("../models/vote");

const getNominate = async (req, res) => {
  const nominate = await Nominate.find({});
  res.status(200).json(nominate);
};

const postVote = async (req, res) => {
  const { name, family, vote } = req.body;

  try {
    const vot = await Vote.create({ name, family, vote });
    res.status(200).json(vot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNominate,
  postVote,
};
