const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const appRoutes = require("./routes/appRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use("/voting/app", appRoutes);
app.use("/voting/admin", adminRoutes);

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
