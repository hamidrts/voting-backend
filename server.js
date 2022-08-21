const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const homeRoutes = require("./routes/homeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use("/voting", homeRoutes);
app.use("/voting/admin", adminRoutes);
app.use("/voting/users", usersRoutes);

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
