
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    gender:{type:String,required:true,match:/^^M(ale)?$|^F(emale)?$/},
    email_id:{ 
        type: String,
        required:true,
        unique: true,
        match:/^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
    },
    password: { type: String },
    role: {
        type: String,
        default: 'user',
        enum: ["user", "admin"]
       },
       accessToken: {
        type: String
       },
    age:{type:Number,required:true,match:/^(1[89]|[2-9]\d)$/},
    address:{
        city:{type:String},
        state:{type:String},
        country:{type:String},
        pincode:{type:Number}
}},
{
    timestamps:true
});
UserSchema.index({ email_id:1 }, { unique: true })

const User = mongoose.model('Model', UserSchema);
module.exports=User