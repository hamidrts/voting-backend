const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidSchema = new Schema({
  candidName: {
    type: String,
    required: true,
  },
  family: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
  achivement: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const electionSchema = new Schema(
  {
    department: {
      type: String,
      required: true,
    },
    electionName: {
      type: String,
      required: true,
    },
    term: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    finishDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    candidates: [candidSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("election", electionSchema);
