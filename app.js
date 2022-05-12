require('dotenv').config();
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/index')
const cors = require('cors')
var createError = require("http-errors");
var packageFile = require("./package.json");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express()
const port = 3000

// InMemroy mongoDB Database connection
 async function connectToInMemoryDatabase (){
  const mongod = new MongoMemoryServer();
  const uri = await mongod.getUri();
  //dataBase connection
  mongoose.connect(uri , { useNewUrlParser : true, useUnifiedTopology : true})
  .then((res)=>console.log('> Connected...'.bgCyan))
  .catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))
}

connectToInMemoryDatabase();

//Server Listener
app.listen(port, () => console.log(`movie management app listening on port ${port}!`))

//Minddleware
app.use(cors({ origin: 'http://localhost:8080'}));
app.use(express.json());

app.use("/health", function (req, res) {
    var now = new Date();
    res.json({
      name: packageFile.name,
      status: "ok",
      version: packageFile.version,
      ts: now.getTime(),
      local: now.toLocaleString(),
      utc: now.toUTCString()
    });
  });

app.use('/', indexRoutes);

//Important: Keep at after all routes covers
app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    // Manage all type of error here and return appropriate error in json object to frontend
    res.locals.message = err.message;
    res.status(err.status || 500);
    res.json({
        message: res.locals.message,     
      });
  });

  module.exports = app;