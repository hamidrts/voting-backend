const mongoose = require("mongoose");
const Election = require("../models/election");
const Vote = require("../models/vote");

const closeElection = async () => {
  const elections = await Election.find({
    status: "open",
    finishDate: { $lt: new Date() },
  });

  if (elections) {
    for (let i = 0; i < elections.length; i++) {
      const closedElection = await setResult(elections[i]);
    }
  }
};

const setResult = async (election) => {
  let result = {};
  let electionVotes = [];
  let votes = await Vote.find({ electionId: election._id });
  let winnerVotes = 0;
  let winner = [];

  if (votes.length > 0) {
    election.candidates.forEach((element) => {
      let candidVotes = {};
      let voteCount = 0;
      votes.forEach((vote) => {
        if (vote.candidateId === element._id.toHexString()) {
          voteCount += 1;
        }
      });
      if (voteCount > winnerVotes) {
        winner = [];
        winner.push(element._id.toHexString());
      }
      if (voteCount === winnerVotes) {
        winner.push(element._id.toHexString());
      }
      candidVotes.candid = element._id.toHexString();
      candidVotes.votes = voteCount;
      electionVotes.push(candidVotes);
    });
  }
  result.vote = electionVotes;
  result.winner = winner;
  let closeedElection = await Election.findOneAndUpdate(
    { _id: election._id },
    { status: "close", result: result }
  );
  return closeedElection;
};

module.exports = closeElection;
