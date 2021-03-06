const express = require("express");
require("./db/mongoose");
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next)=> {
//   console.log(req.method,req.path)
//   next()
// })

// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon')
// });

// this will parse incoming json to object
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Without middleware: new request --> run route handler

// With middleware: new request --> do something --> run route handler


app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

