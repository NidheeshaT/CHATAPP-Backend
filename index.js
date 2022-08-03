const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const sockets = require('./sockets');
const mongoose = require('mongoose');
const routes=require("./auth")
const session=require("express-session")
mongoose.connect('mongodb://localhost:27017/ChatApp').then(()=>{
  console.log("connection done");
});
const MongoStore=require("connect-mongodb-session")(session)

// console.log(MongoStore())

const port=80
const Time=1000*60*60
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials:true
  }
))

const sessionMidware=session({
  secret:"hello world",
  resave: false,
  saveUninitialized: false,
  cookie:{
    // sameSite:"none",
    maxAge:Time,
    // httpOnly:true,
    // secure:true
  },
  store:new MongoStore({uri:'mongodb://localhost:27017/ChatApp',collection:"mySessions"})
})
app.use(sessionMidware)
app.use(express.json())

app.use(routes,session)

const server = http.createServer(app);
sockets(server)

server.listen(port, () => {
  console.log('listening on http://localhost:80');
});
