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
      let result = [];
      let votes = await Vote.find({ electionId: elections[i]._id });

      if (votes.length > 0) {
        elections[i].candidates.forEach((element) => {
          let candidVotes = {};
          let voteCount = 0;
          votes.forEach((vote) => {
            if (vote.candidateId === element._id.toHexString()) {
              voteCount += 1;
            }
          });
          candidVotes.candid = element._id.toHexString();
          candidVotes.votes = voteCount;
          result.push(candidVotes);
        });
      }
      let closeedElection = await Election.findOneAndUpdate(
        { _id: elections[i]._id },
        { status: "close", result: result }
      );
    }
  }
};

module.exports = closeElection;
