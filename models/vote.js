const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    electionId: {
      type: String,
      required: true,
    },
    candidateId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("vote", voteSchema);
