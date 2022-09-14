const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schedule = require("node-schedule");
const closeElection = require("./schedule-job/closeElection");
const openElection = require("./schedule-job/openElection");
const { Server } = require("socket.io");
const http = require("http");
const Vote = require("./models/vote");

schedule.scheduleJob("0 1 * * *", closeElection);
schedule.scheduleJob("0 1 * * *", openElection);

const appRoutes = require("./routes/appRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(cors());
require("dotenv").config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.use("/voting/app", appRoutes);
app.use("/voting/admin", adminRoutes);

const sentVotesToAdmin = (electionId) => {
  console.log("hey");
  io.on("connection", (socket) => {
    const getVote = async () => {
      const votes = await Vote.find({ electionId: electionId });
      socket.broadcast.emit("receive_message", { message: votes });
    };
    getVote();
  });
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("i am listening at port 5000");
    });
    console.log("DB has been conected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = sentVotesToAdmin;
