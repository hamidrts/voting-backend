const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const homeRoutes = require("./routes/homeRoutes");
const adminRout = require("./routes/adminRoutes");
const usersRout = require("./routes/usersRoutes");

const app = express();

app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use("/voting", homeRoutes);
app.use("/voting/admin", adminRout);
app.use("/voting/users", usersRout);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("i am listening at port 5000");
    });
    console.log("DB has been conected");
  })
  .catch((err) => {
    console.log(err);
  });
