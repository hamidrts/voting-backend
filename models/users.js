const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

usersSchema.statics.signup = async function (
  name,
  email,
  department,
  userImage,
  password
) {
  if (!name || !email || !department || !password) {
    throw Error("all field must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Inter valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }
  const exist = await this.findOne({ email });

  if (exist) {
    throw Error("Email already exist");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({
    name,
    email,
    department,
    userImage,
    password: hash,
  });
  return user;
};

usersSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("all field must be filled");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

module.exports = mongoose.model("user", usersSchema);
