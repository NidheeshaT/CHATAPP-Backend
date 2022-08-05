const User=require("../models/Users")
const auth=async (req,res,next)=>{
    console.log("hiii")
    console.log(req.session)
    try{
        if(req.session)
        {
            let k=await User.userInfo(req.session.userId)
            // console.log(k)
            res.send(k)
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