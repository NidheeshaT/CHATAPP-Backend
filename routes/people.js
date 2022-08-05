const { Router } = require('express');
let router=Router()
const User=require("../models/Users")
const handleRequests=require('../controllers/requests')

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

router.use(handleRequests)
router.post("/friends/remove",async(req,res)=>{
    try{
        let user=req.user
        let friend=req.friend
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
        let user=req.user
        let friend=req.friend
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
        let user=req.user
        let friend=req.friend
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
        let user=req.user
        let friend=req.friend
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
        let user=req.user
        let friend=req.friend
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