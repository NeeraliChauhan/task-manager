const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is Invalid!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('password cannot contain "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  // It will automatically create createdAt and updatedAt in db
  timestamps: true
});

// Virtual property is a relation between 2 entities
userSchema.virtual('tasks',{
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// methods are available for instance
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token
}

// methods are available for instance
userSchema.methods.getPublicProfile = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

// methods are available for instance
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

// statics methods are available on the model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if(!user){
    throw new Error('Unable to find user!');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    throw new Error('Unable to login!');
  }
  return user;
}
// mongoose provides 2 middleware functions pre and post i.e.
// pre to perform before the event, post to perform after the event.
// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }
 // next function will let the mongoose know that this is complete proceed further
  next();
})

// Delete user task when user is removed

userSchema.pre('remove', async function(next){
  const user = this;
  await Task.deleteMany({ owner: user._id})
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;

// middleware is something that we can register to run before or after the event occurs