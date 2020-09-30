// CRUD create read update and delete

// mongodb creates a connection pool, i.e. there are more connections open behind the scene even we have opened one.
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if(error){
    return console.log('Unable to connect to database');
  }

  const db = client.db(databaseName);

  // db.collection("users").findOne(
  //   { _id: new ObjectID("5f4a53cbece52042acbb4105") },
  //   (error, user) => {
  //     if (error) {
  //       return console.log("Unable to fetch");
  //     }
  //     console.log(user);
  //   }
  // );

  // find returns a cursor that points to the documents in the db
  // db.collection('users').find({ age: 26 }).toArray((error, users)=> {
  //    if (error) {
  //      return console.log("Unable to fetch");
  //    }
  //    console.log(users)
  // })

  // db.collection("users")
  //   .find({ age: 26 })
  //   .count((error, count) => {
  //     if (error) {
  //       return console.log("Unable to fetch");
  //     }
  //     console.log(count);
  //   });

  // db.collection('users').insertOne({
  //   name: "Vikram",
  //   age: 26
  // }, (error, result) => {
  //   if(error){
  //     return console.log('Unable to insert data!');
  //   }
  //   console.log('result--', result.ops)
  // })

  // db.collection('tasks').insertMany([
  //   {
  //    description: 'Prepare food',
  //    completed: false
  //   },
  //   {
  //     description: "Laundry",
  //     completed:true
  //   },
  //   {
  //     description: "Complete Nodejs",
  //     completed: true
  //   }
  // ], (error, result)=> {
  //   if(error){
  //     return console.log("Unable to insert documents");
  //   }
  //   console.log(result.ops)
  // })

//   const updatePromise = db.collection("users").updateOne({
//     _id: new ObjectID("5f4a47633c6aa53e76b5e1db")
//   },{
//     $set: {
//       name: "Rony"
//     }
//   });

//   updatePromise
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.log(error);
//     });

  // db.collection("users").updateOne({
  //   _id: new ObjectID("5f4a47633c6aa53e76b5e1db")
  // },{
  //   $set: {
  //     name: "Rony"
  //   }
  // }).then((result) => {
  //     console.log(result);
  // }).catch((error) => {
  //     console.log(error);
  // });

 // $inc increment or decrement numbers
  // db.collection("users").updateOne({
  //   _id: new ObjectID("5f4a47633c6aa53e76b5e1db")
  // },{
  //   $inc: {
  //     age: -1
  //   }
  // }).then((result) => {
  //     console.log(result);
  // }).catch((error) => {
  //     console.log(error);
  // });

  // db.collection("tasks").updateMany({
  //   completed: false
  // }, {
  //   $set:{
  //     completed: true
  //   }
  // }).then((result)=> {
  //     console.log(result);
  // }).catch((error)=> {
  //   console.log(error)
  // })

  // db.collection("users").deleteMany({
  //   age: 23
  // }).then((res)=> {
  //   console.log(res);
  // }).catch((err)=> {
  //   console.log(err);
  // })

  db.collection("tasks").deleteOne({
    description: "Laundry"
  }).then((res)=> {
    console.log(res);
  }).catch((err)=> {
    console.log(err);
  })
  
})

