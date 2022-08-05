const mongoose=require("mongoose")

const {Schema}=mongoose;

const UserSockets=new Schema({
    nickname:{
        type:String,
        minLength:5,
        unique:true,
        required:true
    },
    socketID:{type:String}
})

const UserSocketsModel= mongoose.model('UserSockets',UserSockets)
module.exports=UserSocketsModel