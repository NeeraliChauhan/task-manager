const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    sendWelcomeEmail(user.email, user.name);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req,res)=> {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken();
    console.log(user.getPublicProfile());
    // 1st method
    // res.send({user: user.getPublicProfile(), token});

    //2nd method
    res.send({ user, token });
  }catch(e){
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res)=> {
  try {
    req.user.tokens = req.user.tokens.filter((token)=> {
      return token.token != req.token
    })
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send();
  }
})

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user )
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {

    // this will bypass the middleware
    // new: true will return the new user after update i.e. the latest data
    // runValidators will validate the data we r trying to update
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });


    // To run the middleware in models this change is required

    updates.forEach((update) =>req.user[update] = req.body[update]);
    await req.user.save()
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer ({
  // if we dont provide dest, it will provide the binary file data of that image, otherwise it will 
  // just store the data in the dest folder
  // dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

// auth is added before upload middleware cuz only authenticated users are allowed to add img
router.post('/users/me/avatar',auth, upload.single('avatar'),async (req, res)=> {
  req.user.avatar = req.file.buffer;
  await req.user.save()
  res.send()
}, (error, req, res, next)=>{
  // This function is designed to handle errors from multer
  res.status(400).send({error: error.message})
})

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save()
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/:id/avatar", async (req, res)=>{
  try {
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar){
      throw new Error()
    }
   // res.set helps in setting headers 
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
  }catch(e){
    res.status(404).send()
  }
})
module.exports = router;