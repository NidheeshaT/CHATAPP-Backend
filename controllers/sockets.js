const UserSocketsModel=require('../models/UserSockets')
const sessionMidware=require("./sessionController")

const connect=(server)=>{
    const socket = require("socket.io");
    const io = socket(server,{
      cors:{
      origin: 'http://localhost:3000',
      credentials:true
      }
    });

    io.use( (socket, next)=> {
      sessionMidware(socket.request, {}, next);
    });

    
    io.on("connection",async (socket) => {
      let user=await UserSocketsModel.findOne({nickname:socket.request.session.nickname})
      if(user)
      {
        user.socketID=socket.id
        await user.save()
      }
      else{
        await UserSocketsModel.create({nickname:socket.request.session.nickname,socketID:socket.request.sessionID})

      }

    
    socket.on("message",async (to,data)=>{
      const msg={message:data,al:"left"}
      console.log(socket.id)
      const friend=await UserSocketsModel.findOne({nickname:to})
      console.log(friend.socketID)
      io.to(friend.socketID).emit("message",socket.request.session.nickname,msg);
    })
    socket.on('disconnect',async()=>{
      console.log("User disconnected",socket.id)
      await UserSocketsModel.findOneAndDelete({nickname:socket.request.session.nickname})
    })
    });
    
}

module.exports=connect;