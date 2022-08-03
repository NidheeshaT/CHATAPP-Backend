const mongoose=require("mongoose")

const {Schema}=mongoose;

const User=new Schema({
    name:{type:String,required:true},
    nickname:{
        type:String,
        minLength:5,
        unique:true,
        required:true
    },
    email:{type:String,unique:true,required:true},
    description:{type:String,default:()=>"Hi just exploring life"},
    password:{type:String,required:true,minLength:8},
    friends:{type:[mongoose.SchemaTypes.ObjectId],ref:'Users',default:()=>[]},
    requestSent:{type:[mongoose.SchemaTypes.ObjectId],ref:'Users',default:()=>[]},
    requestRecieved:{type:[mongoose.SchemaTypes.ObjectId],ref:'Users',default:()=>[]}
})
User.statics.findByEmail=function (email){
    return this.model('Users').findOne({email:email})
}
User.statics.findByNickname=function (nickname){
    return this.model('Users').findOne({nickname:nickname})
}
User.statics.userInfo=function (id){
    return this.model('Users').findById({_id:id},{password:0,_id:0}).populate("friends",{name:1,nickname:1,description:1,_id:0}).populate("requestSent",{nickname:1,description:1,_id:0}).populate("requestRecieved",{nickname:1,description:1,_id:0})
}
User.statics.public=function (nickname){
    return this.model('Users').find({nickname:{$regex:nickname}},{nickname:1,description:1,_id:0})
}
const userModel=mongoose.model("Users",User);
module.exports=userModel

