const {ValidateUserLogin} = require('../model/user');
function validateLogin(req,res,next){
    let {error} = ValidateUserLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    next();
}
module.exports = validateLogin;