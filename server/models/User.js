const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    username: {type:String, required: true},
    email: {type:String, required: true},
    password: {type: String, required: true},
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date }
})

userSchema.methods.generateAuthToken = function() {
    try {
        if (!process.env.JWTPRIVATEKEY) {
            throw new Error('JWTPRIVATEKEY is not defined');
        }
        const token = jwt.sign(
            { 
                _id: this._id,
                email: this.email,
                isAdmin: this.isAdmin
            }, 
            process.env.JWTPRIVATEKEY, 
            { expiresIn: "7d" }
        );
        return token;
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
}

const User = mongoose.model("users", userSchema)

const validate = (data) => {
    const schema = joi.object({
        firstName: joi.string().required().label("First Name"),
        lastName: joi.string().required().label("Last Name"),
        username: joi.string().required().label("Username"),  
        email: joi.string().email().required().label("Email"), 
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
}


module.exports= {User, validate};