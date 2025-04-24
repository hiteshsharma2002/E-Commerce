const { check } = require('express-validator');

exports.registeredValidator = [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check('mobile', 'mobile no. must be of 10 digits').isLength({
        min: 10,
        max:10
    }),
    check('pass', 'password must be greater than 8,contains lower and upper case and special character').isStrongPassword({
        minLength: 8,
        minUppercase: 1, minLowercase: 1,
        minNumbers: 1,
        minSymbols:1
    })
]