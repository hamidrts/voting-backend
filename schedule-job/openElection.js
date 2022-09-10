const mongoose = require("mongoose");
const Election = require("../models/election");
const Vote = require("../models/vote");

const openElection = async (req, res) => {
  const elections = await Election.find({
    status: "planned",
    startDate: { $lt: new Date() },
  });

  if (elections) {
    for (let i = 0; i < elections.length; i++) {
      let openElection = await Election.findOneAndUpdate(
        { _id: elections[i]._id },
        { status: "open" }
      );
    }
  }
};

module.exports = openElection;
