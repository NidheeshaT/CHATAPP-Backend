const UserSocketsModel=require('../models/UserSockets')
const sessionMidware=require("./sessionController")
const socket = require("socket.io");
let io;

const connect=(server)=>{
  io = socket(server,{
    cors:{
    origin: (origin,callback)=>{return callback(null,true)},
    credentials:true
    }
  });
  console.log("hi")
    io.use( (socket, next)=> {
      sessionMidware(socket.request, {}, next);
    });

    
    io.on("connection",async (socket) => {
      let user=null
      if(socket.request.session.nickname)
        user=await UserSocketsModel.findOne({nickname:socket.request.session.nickname})
      if(user)
      {
        user.socketID=socket.id
        await user.save()
      }
      else{
        if(socket.request.session.nickname)
          await UserSocketsModel.create({nickname:socket.request.session.nickname,socketID:socket.id})

      }

    
    socket.on("message1",async (to,data)=>{
      const msg={message:data,al:"left"}
      const friend=await UserSocketsModel.findOne({nickname:to})
      if(friend)
      {
        io.to(friend.socketID).emit("message",socket.request.session.nickname,msg);
      }
    })
    socket.on('disconnect',async()=>{
      await UserSocketsModel.findOneAndDelete({nickname:socket.request.session.nickname})
    })
    });
}

const update= async(to)=>{
  try{
    const friend=await UserSocketsModel.findOne({nickname:to})
    io.to(friend.socketID).emit("refetch");
  }
  catch{
    
  }
}

module.exports={connect:connect,update:update};