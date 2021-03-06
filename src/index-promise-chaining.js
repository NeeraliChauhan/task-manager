const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require("./models/task");
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT  || 3000;

// this will parse incoming json to object
app.use(express.json());

app.post('/users', (req, res)=> {
  const user = new User(req.body)
  user.save().then(()=> {
    res.status(201).send(user)
  }).catch((err)=> {
    res.status(400).send(err);
  })
})

app.get('/users', (req, res)=> {
  User.find({}).then((resp)=> {
    res.send(resp)
  }).catch((err)=> {
    res.status(500).send(err);
  })
})

app.get('/users/:id', (req, res)=> {
  const _id = req.params.id;
  User.findById(_id).then((resp)=> {
    if(!resp){
      return res.status(404).send();
    }
    res.send(resp);
  }).catch((err)=> {
    res.status(500).send(err);
  })
})

app.post('/tasks', (req, res)=> {
  const task = new Task(req.body)
  task.save().then(()=> {
    res.status(201).send(task)
  }).catch((err)=> {
    res.status(400).send(err);
  })
})

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/tasks/:id', (req, res)=> {
  const _id = req.params.id;
  Task.findById(_id).then((resp)=> {
    if(!resp){
      return res.status(404).send();
    }
    res.send(resp);
  }).catch((err)=> {
    res.status(500).send(err);
  })
})


app.listen(port, ()=> {
  console.log(`Server is up on ${port}`);
})