require('dotenv').config();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var _ = require("lodash");
var jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const config = require("config");

const Speakeasy = require("speakeasy");
var validateLogin = require("../../middleware/validateLogin");
var validateRegister = require("../../middleware/validateRegister");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN; 
const accountSid='AC93f00746af027f84821762537cf05629';
const authToken='20d8fc59047502948f65b30ae140d9fd';
const client = require('twilio')(accountSid, authToken); 

/* GET users listing. */
let {User} = require("../../model/user");
router.post("/register",validateRegister,async(req,res)=>{
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).send("User with email already exists");
        user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password= req.body.password;
        await user.generatePassword();
        user.phone=req.body.phone;
        
       
        let otpToken = Speakeasy.totp({
                secret: req.body.secret,
                encoding: "base32"
            });
        
        user.otp = otpToken;
        let expiresIn = new Date().getTime() + 200*1000;
        user.expiresIn = expiresIn;
        await user.save();

 
        client.messages 
        .create({       
                body:"Your Verification code is "+ user.otp,
                to: req.body.phone,
                from:'+18336126912'
        }) 
        .then(message => console.log(message.sid)) 
        .done();
        let token = jwt.sign({_id: user._id,name: user.name,role: user.role},config.get("jwtPrivateKey"));
        let datatoReturn = {
                name:user.name,
                email:user.email,
                token:user.token
        }
        res.send(token);
        
});
router.post("/login",validateLogin,async(req,res)=>{
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("User with the email not registered");
        let isValid = await bcrypt.compare(req.body.password,user.password);
        if(!isValid) return res.status(401).send("User password is invalid!");
        if(user.status == 'unverified') return res.status(400).send("Please verify otp to login");
        let token = jwt.sign({_id: user._id,name: user.name,role:user.role},config.get("jwtPrivateKey"));
        res.send(token);
});
/* admin-login */
router.post("/adminlogin",validateLogin,async(req,res)=>{
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("User with the email not registered");
        let isValid = await bcrypt.compare(req.body.password,user.password);
        if(!isValid) return res.status(401).send("User password is invalid!");
        if(user.role == 'user') return res.status(403).send("Please enter admin credentials");
        let token = jwt.sign({_id: user._id,name: user.name,role:user.role},config.get("jwtPrivateKey"));
        res.send(token);
});
router.post("/verifyotp",async(req,res)=>{
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).send("User with the email not registered");
        let currentTime = new Date().getTime();
        let diff = user.expiresIn-currentTime;
        if(diff < 0) {
                return res.status(400).send("Otp time expired");
        }
        else{
                if(user.otp == req.body.otp){
                        user.status = 'verified';
                        await user.save();
                        return res.status(200).send("Otp sucessfully verified!");
                        
                }
                else{
        
                        return res.status(401).send("Please enter correct otp");
                        
                }
        }
        
        
});
/* get latest 3 registered user data */
router.get("/getlastusers",async(req,res)=>{
        let users = await User.find();
        if(!users) return res.status(404).send("No Users in database");
        let last= users.slice(-3);
        res.send(last);
});

router.get("/getusers",async(req,res)=>{
        let users = await User.find();
        if(!users) return res.status(404).send("No Users in database");
        
        res.send(users);

});
/* count total number of user in db */
router.get("/countusers",async(req,res)=>{
        User.count( {}, async function(err, result){

                if(err){
                    res.send(err);
                }
                else{
                    res.json(result);
                }
        
           });

});
router.delete("/delete/:id",async(req,res)=>{
        let users = await User.findByIdAndDelete(req.params.id);
        if(!users) return res.status(404).send("User with id not available");
        res.send(users);

});
/* get single user data */
router.get("/:id",async(req,res)=>{
        try{
                let user = await User.findById(req.params.id);
                console.log(user);
                res.send(user);
            }
            catch(err){
                res.status(400).send("Invalid id");
            }
});

router.put("/:id",validateRegister,async(req,res)=>{
        let user = await User.findById(req.params.id);
        user.name=req.body.name;
        user.email=req.body.email;
        user.password=req.body.password;
        user.phone=req.body.phone;
        await user.generatePassword();
        await user.save();
        res.send(user);

});

module.exports = router;
