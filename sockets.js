const connect=(server,session)=>{
    const socket = require("socket.io");
    const io = socket(server,{
      cors:{
      origin: 'http://localhost:3000',
      credentials:true
      }
    });
    io.use( (socket, next)=> {
      session(socket.request, {}, next);
    });
    io.sockets.on("connection", (socket) => {
    socket.request.session.socketID=socket.id
    socket.on("message",(to,data)=>{
      let msg={value:data,al:"left"}
      socket.to(to).emit("message",socket.id,msg);
    })
    socket.on('disconnect',()=>{
      console.log("User disconnected",socket.id)
      socket.request.session.socketID=null
    })
    });
    
}

module.exports= connect;