var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var ContactSchema = mongoose.Schema({
    name:String,
    subject:String,
    email:String,
    message:String
});
function ValidateContact(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        subject: Joi.string().min(5).required(),
        email: Joi.string().email().min(10).max(30).required(),
        message: Joi.string().min(5).max(50).required(),

    });
    return schema.validate(data,{aboutEarly: false});

}
var Contact = mongoose.model("contact",ContactSchema);
module.exports.Contact = Contact;
module.exports.validate = ValidateContact;