const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const {connect} = require('./controllers/sockets');
const mongoose = require('mongoose');
const mainroutes=require("./routes/loreg")
const peopleroutes=require("./routes/people")
const sessionMidware=require("./controllers/sessionController.js")
require('dotenv').config()

mongoose.connect(process.env.CONNECT_DB_URL||'mongodb://localhost:27017/ChatApp').then(()=>{
  console.log("connection done");
});

app.set("trust proxy",1)
app.use(cors(
  {
    origin: (origin,callback)=>{return callback(null,true)},
    credentials:true
  }
))

app.use(sessionMidware)
app.use(express.json())

app.use(mainroutes)
app.use(peopleroutes)

const server = http.createServer(app);
connect(server)

server.listen(process.env.PORT||80, () => {
  console.log('listening on http://localhost:80');
});