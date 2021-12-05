var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var _ = require("lodash");
var jwt = require("jsonwebtoken");
const config = require("config");
const validateStore = require("../../middleware/validateStore");
/* GET users listing. */
let {Store} = require("../../model/store");
const sgMail = require('@sendgrid/mail');
const API_KEY = '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';
sgMail.setApiKey(API_KEY);

const validateStoreRegister = require('../../middleware/validateStore');
router.post("/",validateStoreRegister,async(req,res)=>{
        let store = await Store.findOne({email:req.body.email});
        if(store) return res.status(400).send("User with email already send request");
        store = new Store();
        store.name = req.body.name;
        store.url = req.body.url;
        store.email = req.body.email;
        store.phone = req.body.phone;
        store.location = req.body.location;
        await store.save();
        const msg = {
                to: req.body.email,
                from: {
                    name: 'Techwire',
                    email: 'sp18-bse-116@cuilahore.edu.pk',
                },
                subject: 'Confirmation Mail from sendGrid',
                text: 'Helloo !!',
                html: '<div><h5>Hello Store Owner, You Store Register Request has been received succesfully.We will look into your Store Details and contact you back Shortly.Thanks for your response!<h3> </div>',
            };
        sgMail.send(msg);
        res.send(_.pick(store,["name","email"]));
});
//update record
router.put('/:id',validateStore,async function(req, res, next) {
        let store = await Store.findById(req.params.id);
        store.name= req.body.name;
        store.url = req.body.url;
        store.email = req.body.email;
        store.phone = req.body.phone;
        store.location = req.body.location;
        await store.save();
        res.send(store); 
    });
//delete a record
router.delete('/:id', async function(req, res, next) {
        let store = await Store.findByIdAndDelete(req.params.id);
        if(!store) return res.status(404).send("No Store available");
        res.send(store); 
    });
router.post("/login",async(req,res)=>{
        let store = await Store.findOne({email:req.body.email});
        if(!store) return res.status(400).send("User with the email not registered");
        let isValid = await bcrypt.compare(req.body.password,store.password);
        if(!isValid) return res.status(401).send("User password is invalid!");
        let token = jwt.sign({_id: store._id,name: store.name},config.get("jwtPrivateKey"));
        res.send(token);
});
router.get("/getrecords",async(req,res)=>{
    let stores = await Store.find();
    if(!stores) return res.status(404).send("No Store Record in database");
    res.send(stores);

});
router.get("/getcount",async(req,res)=>{
    Store.count( {}, async function(err, result){

        if(err){
            res.send(err);
        }
        else{
            res.json(result);
        }

   });

});
router.get('/:id', async function(req, res, next) {
    let store = await Store.findById(req.params.id);
    if(!store) return res.status(404).send("No Store found");
    res.send(store); 
});
module.exports = router;
