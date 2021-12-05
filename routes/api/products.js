var express = require('express');
var router = express.Router();
var validateProduct = require('../../middleware/validateProduct');
var {Product,validate} = require("../../model/product");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
/* GET users listing. */
router.get('/', async function(req, res, next) {
    console.log(req.user);
    let products = await Product.find();
    res.send(products); 
});
//post a record
router.post('/', validateProduct, async function(req, res) {
    
    let product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.url = req.body.url;
    product.detail = req.body.detail;
    await product.save();
    res.send(product); 
});
//get single record //
router.get('/:id', async function(req, res, next) {
    try{
        let product = await Product.findById(req.params.id);
        res.send(product);
    }
    catch(err){
        res.status(400).send("Invalid id");
    }
     
});
//update record
router.put('/:id', validateProduct, async function(req, res, next) {
    let product = await Product.findById(req.params.id);
    product.name= req.body.name;
    product.price = req.body.price;
    product.url = req.body.url;
    product.detail = req.body.detail;
    await product.save();
    res.send(product); 
});
//delete a record
router.delete('/:id', async function(req, res, next) {
    let product = await Product.findByIdAndDelete(req.params.id);
    if(!product) return res.status(404).send("No product available");
    res.send(product); 
});

module.exports = router;
