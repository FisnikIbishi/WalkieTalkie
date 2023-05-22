// user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your password!')
      } else if (validator.equals(value.toLowerCase(), "password")) {
        throw new Error('Password is invalid!')
      } else if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error('Password should not contain password!')
      }
    }
  },
  role: {
    type: String,
    default: Role.User,
    enum: [Role.Admin, Role.User]
  },
  description: { type: String, required: false },
  token: { type: String }
});

userSchema.statics.checkValidCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login!')
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login!')
  }

  return user
}

userSchema.methods.newAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user.id.toString(), role: user.role }, process.env.JWT_SECRET)
  user.token = token
  await user.save()
  return token
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()

  delete userObj.password
  delete userObj.tokens

  return userObj
}

//hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.pre('remove', async function (next) {
  next()
})

const User = mongoose.model('User', userSchema);
module.exports = User;
