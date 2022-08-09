const User=require("../models/Users")
const auth=async (req,res,next)=>{
    try{
        if(req.session)
        {
            let rs=await User.userInfo(req.session.userId)
            res.send(rs)
            next('router')
        }
        else{
            next()
        }
    }
    catch{
        next()
    }
}

module.exports=auth