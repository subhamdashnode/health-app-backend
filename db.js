const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/health?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const connectToMongoose=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connection to mongo successfully");
    });
}
module.exports=connectToMongoose;

