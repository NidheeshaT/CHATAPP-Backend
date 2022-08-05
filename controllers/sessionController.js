const session=require("express-session")
const Time=1000*60*60
const MongoStore=require("connect-mongodb-session")(session)
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


module.exports=sessionMidware