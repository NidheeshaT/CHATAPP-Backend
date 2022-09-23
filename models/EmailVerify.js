const mongoose=require("mongoose")

const {Schema}=mongoose;

const Email=new Schema({
    email:{
        type:String,
        required:true
    },
    code:{type:String,required:true},
    trys:{type:Number,default:0},
    expiresAt:{
        type:Date,
        default:Date.now,
        index:{expires:"5m"}
    }
})

const EmailModel= mongoose.model('Email',Email)
module.exports=EmailModel