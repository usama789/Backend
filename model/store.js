var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var bcrypt = require('bcryptjs');
var storeSchema = mongoose.Schema({
    name:String,
    url:String,
    email:String,
    phone:String,
    location:String
    
});
// storeSchema.methods.generatePassword = async function(){
//     let salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password,salt);
// }
function ValidateStore(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(15).required(),
        url: Joi.string().required(),
        email: Joi.string().email().min(3).max(30).required(),
        phone: Joi.number().min(13).required(),
        location: Joi.string().min(5).max(30).required(),
       

    });
    return schema.validate(data,{aboutEarly: false});

}
// function ValidateStoreLogin(data){
//     const schema = Joi.object({
//         email: Joi.string().email().min(3).max(10).required(),
//         password: Joi.string().min(3).max(10).required(),

//     });
//     return schema.validate(data,{aboutEarly: false});

// }
var Store = mongoose.model("store",storeSchema);
module.exports.Store = Store;
module.exports.validate = ValidateStore;   //for sign up
// module.exports.ValidateStoreLogin = ValidateStoreLogin;   //for login