var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var bcrypt = require('bcryptjs');
var userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"user"

    },
    otp:String,
    status:{
        type:String,
        default:"unverified"
    },
    expiresIn:String,
    phone:String
});
userSchema.methods.generatePassword = async function(){
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
}
function ValidateUser(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().min(3).max(25).required(),
        password: Joi.string().min(3).max(15).required(),
        phone: Joi.string().min(13).required(),

    });
    return schema.validate(data,{aboutEarly: false});

}
function ValidateUserLogin(data){
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(25).required(),
        password: Joi.string().min(3).max(15).required(),

    });
    return schema.validate(data,{aboutEarly: false});

}
var User = mongoose.model("user",userSchema);
module.exports.User = User;
module.exports.validateUser = ValidateUser;   //for sign up
module.exports.ValidateUserLogin = ValidateUserLogin;   //for login