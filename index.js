const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const sockets = require('./controllers/sockets');
const mongoose = require('mongoose');
const mainroutes=require("./routes/loreg")
const peopleroutes=require("./routes/people")
const sessionMidware=require("./controllers/sessionController.js")
mongoose.connect('mongodb://localhost:27017/ChatApp').then(()=>{
  console.log("connection done");
});
const port=80
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials:true
  }
))

app.use(sessionMidware)
app.use(express.json())

app.use(mainroutes)
app.use(peopleroutes)

const server = http.createServer(app);
sockets(server)

server.listen(port, () => {
  console.log('listening on http://localhost:80');
});
