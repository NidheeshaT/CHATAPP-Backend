const { Router } = require('express');
let router=Router()
const User=require("./models/Users")

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

router.post("/register",async(req,res)=>{
    let msg={}
    let user=await User.findByEmail(req.body.email)
    if(user)
        msg={error:"Email taken"}
    else if(user=await User.findByNickname(req.body.nickname))
        msg={error:"Nickname taken"}
    else{
        try{
            
            await User.create(req.body).then(()=>{
                console.log("Document inserted")
            })           

            msg=req.body
        }
        catch(e){
            console.log(e.message)
            msg={error:"Bad request"}
        }
    }
    res.send(msg)
    
})
router.post("/login",async(req,res,next)=>{
    // console.log(req.sessionID)
    let user=await User.findByEmail(req.body.email)
    if(user && user.password==req.body.password)
    {
        req.session.userId=user._id;
        user=await User.userInfo(user._id)
        res.send(user)
        console.log(req.session)
   }
    else{
        res.send({error:"Incorrect username or password"})
    }
})

router.post("/people",async(req,res)=>{
    try{
        let lim=10
        let users=await User.public(req.body.username).limit(lim)
        res.send(users)
    }
    catch{
        res.send({error:"Bad request"})
    }
})

router.get("/info",async(req,res)=>{
    try{
        res.send(await User.public(req.body.nickname))
    }
    catch{
        res.send({error:"Bad request"})
    }
})


router.post("/friends/remove",async(req,res)=>{
    try{
        let user=await User.findByNickname(req.body.username)
        let friend=await User.findByNickname(req.body.friendname)
        let i1=user.friends.indexOf(friend._id)
        let i2=friend.friends.indexOf(user._id)
        if(i1!=-1 && i2!=-1)
        {
            friend.friends.pop(i2)
            user.friends.pop(i1)
            await friend.save()
            await user.save()
            res.send(await User.userInfo(user._id))
        }
        else
        {
            res.send({error:"Bad request"})
        }
    }
    catch(e){
        console.log(e)
        res.send({error:"Bad request"})
    }

})

router.post("/requests/accept",async(req,res)=>{
    try{
        let user=await User.findByNickname(req.body.username)
        let friend=await User.findByNickname(req.body.friendname)
        let i1=user.requestRecieved.indexOf(friend._id)
        let i2=friend.requestSent.indexOf(user._id)

        if(i1!=-1 && i2!=-1)
        {
            user.friends.push(friend._id)
            friend.friends.push(user._id)
            user.requestRecieved.pop(i1) 
            friend.requestSent.pop(i2)
            await friend.save()
            await user.save()
            res.send(await User.userInfo(user._id))
        }
        else
        {
            res.send({error:"BAd request"})
        }
    }
    catch(e)
    {
        console.log(e)
        res.send({error:"BAd request"})
    }

})


router.post("/requests/reject",async(req,res)=>{
    try{
        let user=await User.findByNickname(req.body.username)
        let friend=await User.findByNickname(req.body.friendname)
        let i1=user.requestRecieved.indexOf(friend._id)
        let i2=friend.requestSent.indexOf(user._id)

        if(i1!=-1 && i2!=-1)
        {
            user.requestRecieved.pop( i1) 
            friend.requestSent.pop(i2)
            await user.save()
            await friend.save()
            res.send(await User.userInfo(user._id))
        }
        else
        {
            res.send({error:"BAd request"})
        }
    }
    catch(e){
        res.send({error:"BAd request"})
    }
})

router.post("/requests/cancel",async(req,res)=>{
    try{
        let user=await User.findByNickname(req.body.username)
        let friend=await User.findByNickname(req.body.friendname)
        let i1=user.requestSent.indexOf(friend._id)
        let i2=friend.requestRecieved.indexOf(user._id)
    
        if(i1!=-1 && i2!=-1)
        {
            user.requestSent.pop(i1) 
            friend.requestRecieved.pop(i2)
            await user.save()
            await friend.save()
            res.send(await User.userInfo(user._id))
        }
        else
        {
            res.send({error:"BAd request"})
        }
    }
    catch(e)
    {
        console.log(e)
        res.send({error:"BAd request"})
    }

})

router.post("/requests/send",async(req,res)=>{
    try{
        let user=await User.findByNickname(req.body.username)
        let friend=await User.findByNickname(req.body.friendname)
        if(user.requestSent.includes(friend._id))
        {
            res.send({error:"Request already sent"})
            return
        }
        else if(user.friends.includes(friend._id)){
            res.send({error:"Already friends"})
            return
        }
        friend.requestRecieved.push(user._id)
        user.requestSent.push(friend._id)

        await user.save()
        await friend.save()
        res.send(await User.userInfo(user._id))
    }
    catch(e){
        res.send({error:"Bad request"})
    }
})



module.exports=router