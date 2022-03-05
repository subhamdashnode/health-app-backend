const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:['male','femail','other']
    },
    date_of_birth:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    specialization:{
        type:String
    },
    pincode:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("auth", UserSchema);
