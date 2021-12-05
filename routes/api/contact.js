
var express = require('express');
var router = express.Router();
const {Contact} = require("../../model/contact");
var validateContact = require("../../middleware/validateContact")
var admin = require("../../middleware/admin");
const sgMail = require('@sendgrid/mail');
const API_KEY = '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';
sgMail.setApiKey(API_KEY);
router.get("/",async function(req,res){
        let contact = await Contact.find();
        res.send(contact);

});
/* messages count */
router.get("/count",async function(req,res){
    console.log('here');
    Contact.count({},  function(err, result){

        if(err){
            res.send(err);
        }
        else{
            res.json(result);
        }
        // res.send('here');

   });
});
router.get("/:id",async function(req,res){
    let contact = await Contact.findById(req.params.id);
    if(!contact) return res.status(404).send("No contact available");
   
    res.send(contact);

});

router.post("/",validateContact,async function(req,res){
    let contact = new Contact();
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.subject = req.body.subject;
    contact.message = req.body.message;
    await contact.save();
    const msg = {
        to: req.body.email,
        from: {
            name: 'Techwire',
            email: 'sp18-bse-116@cuilahore.edu.pk',
        },
        subject: 'Confirmation Mail',
        text: 'Helloo !!',
        html: '<div><h5>Hello there, You form has been received succesfully.We will look into your query shortly and inform you back.Thanks for your response!<h5> </div>',
    };
    sgMail.send(msg);
    res.send(contact);

});
router.delete("/:id",async function(req,res){
    let contact = await Contact.findByIdAndDelete(req.params.id);
    if(!contact) return res.status(404).send("No contact available");
    res.send(contact);

});

module.exports = router;
