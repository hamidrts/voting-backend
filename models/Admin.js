const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.statics.signup = async function (username, password) {
  if (!username || !password) {
    throw Error("all field must be filled");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const exist = await this.findOne({ username });

  if (exist) {
    throw Error("Email already exist");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);
  const admin = await this.create({ username, password: hash });
  return admin;
};

adminSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("all field must be filled");
  }
  const admin = await this.findOne({ username });

  if (!admin) {
    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return admin;
};

module.exports = mongoose.model("admin", adminSchema);
