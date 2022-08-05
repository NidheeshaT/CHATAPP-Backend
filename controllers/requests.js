const User=require("../models/Users")
const handleRequests=async (req,res,next)=>{
    try{
        req.user=await User.findByNickname(req.session.nickname)
        req.friend=await User.findByNickname(req.body.friendname)
        next()
    }
    catch{
        res.send({error:"BAd request"})
        next('router')
    }
}

module.exports=handleRequests