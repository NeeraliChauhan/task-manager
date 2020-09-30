const mongoose = require('mongoose');
// const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

// Defining models for the object
// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value){
//       if(!validator.isEmail(value)){
//         throw new Error('Email is Invalid!')
//       }
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 7,
//     validate(value){
//       if(value.toLowerCase().includes('password')){
//         throw new Error('password cannot contain "password"');
//       }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value){
//       if(value < 0){
//         throw new Error('Age must be a positive number')
//       }
//     }
//   }
// });

// const Task = mongoose.model('Task', {
//   description: {
//     type: String,
//     trim: true,
//     required: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   }
// });

// const me = new User({
//   name: " Ross",
//   email: "ross@friends.com ",
//   password: 'rossGeller',
//   age: 26
// })

// me.save().then((me)=> {
//   console.log(me);
// }).catch((err)=> {
//   console.log('Error', err)
// })

// const task1 = new Task({
//   description: "Prepare Supper"
// })

// task1.save().then((task1)=> {
//   console.log(task1);
// }).catch((err)=> {
//   console.log('Error', err);
// })