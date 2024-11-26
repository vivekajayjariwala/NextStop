const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {User} = require("../models/User");

router.post("/", async(req, res) => {
    try {
        console.log('Login attempt for:', req.body.email);
        
        if (!process.env.JWTPRIVATEKEY) {
            console.error('FATAL ERROR: JWTPRIVATEKEY is not defined');
            return res.status(500).send({message: "Server configuration error"});
        }

        const {error} = validate(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).send({message: error.details[0].message});
        }

        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).send({message: "Invalid Email or Password"});
        }

        if (user.isDisabled) {
            return res.status(403).send({
                message: "This account has been disabled. Please contact a site administrator.",
                isDisabled: true
            });
        }

        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
        if (!validPassword) {
            return res.status(401).send({message: "Invalid Email or Password"})
        }

        if (!user.isVerified) {
            return res.status(401).send({
                message: "Please verify your email before logging in",
                verificationToken: user.verificationToken,
                needsVerification: true
            });
        }

        const token = user.generateAuthToken();
        console.log('Login successful for user:', req.body.email);

        res.status(200).send({
            data: token,
            message: "Logged in successfully",
            user: {
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch(error) {
        console.error('Login error:', error);
        res.status(500).send({
            message: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(data);
}

module.exports = router