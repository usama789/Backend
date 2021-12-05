var mongoose = require("mongoose");
var Joi = require("@hapi/joi");
var productSchema = mongoose.Schema({
    name:String,
    price:String,
    url:String,
    detail:String
});
function Validateproduct(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).required(),
        price: Joi.number().min(100).required(),
        url: Joi.string().required(),
        detail: Joi.string().max(100).required(),


    });
    return schema.validate(data,{aboutEarly: false});

}
var Product = mongoose.model("product",productSchema);
module.exports.Product = Product;
module.exports.validate = Validateproduct;