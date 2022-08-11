const { Router } = require('express');
let router=Router()
const User=require("../models/Users")
const auth=require("../controllers/auth")

router.post("/checknickname",async(req,res)=>{
    if(await User.findByNickname(req.body.nickname))
        msg={error:"Nickname taken"}
    else{
        msg=req.body
    }
    res.send(msg)
})
router.post("/checkemail",async(req,res)=>{
    if(await User.findByEmail(req.body.email))
        msg={error:"Email taken"}
    else{
        msg=req.body
    }
    res.send(msg)
})

router.post("/register",auth,async(req,res)=>{
    let msg={}
    let user=await User.findByEmail(req.body.email)
    if(user)
        msg={error:"Email taken"}
    else if(user=await User.findByNickname(req.body.nickname))
        msg={error:"Nickname taken"}
    else{
        try{
            
            user=await User.create(req.body)  
            req.session.userId=user._id;
            req.session.nickname=user.nickname;
            msg=await User.userInfo(user._id)
        }
        catch(e){
            console.log(e.message)
            msg={error:"Bad request"}
        }
    }
    res.send(msg)
    
})
router.post("/login",auth,async(req,res,next)=>{
    let user=await User.findByEmail(req.body.email)
    if(user && user.password==req.body.password)
    {
        req.session.userId=user._id;
        req.session.nickname=user.nickname;
        user=await User.userInfo(user._id)
        res.send(user)
        // console.log(req.session)
   }
    else{
        res.send({error:"Incorrect username or password"})
    }
})

router.post("/info",auth,async(req,res)=>{
    res.send({error:"No cookie"})
})


module.exports=router