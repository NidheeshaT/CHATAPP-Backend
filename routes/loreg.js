const { Router } = require('express');
let router=Router()
const User=require("../models/Users")
const auth=require("../controllers/auth")
const bcrypt=require("bcrypt")
const saltRounds=11
const sendMail=require("../controllers/email")

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
        let str=""
        for(let i=0;i<6;i++)
        {
            str+=Math.floor(Math.random()*10)
        }
        sendMail(req.body.email,str)
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
            req.body.password=await bcrypt.hash(req.body.password,saltRounds)
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
    try{
        if(user && await bcrypt.compare(req.body.password,user.password))
        {
            req.session.userId=user._id;
            req.session.nickname=user.nickname;
            user=await User.userInfo(user._id)
            res.send(user)
        }
        else{
            res.send({error:"Incorrect username or password"})
        }
    }
    catch(e){
        res.send({error:"Incorrect username or password"})
    }
})

router.post("/info",auth,async(req,res)=>{
    res.send({error:"No cookie"})
})

router.post("/logout",async(req,res)=>{
    try{
        req.session.destroy()
        res.send({success:"logged out"})
    }
    catch{
        res.send({error:"Bad request"})
    }
})

module.exports=router