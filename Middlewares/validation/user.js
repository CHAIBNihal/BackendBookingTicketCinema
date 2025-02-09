const { check, validationResult } = require('express-validator')

exports.validateUserSignUp = [
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check("password").trim().not().isEmpty().isLength({ min: 8, max: 20 }).withMessage('password must be within 8 and 20 character '),

];
exports.validateSignin = [
    check('email').trim().isEmail().withMessage("email or password is required"),
    check("password").trim().not().isEmpty().withMessage('email or password is required'),

]


exports.validationRes = (req, res, next )=>{
const result = validationResult(req).array()
if(!result.length) return next();

const error = result[0].msg;
res.json({success : false, message : error})

}


