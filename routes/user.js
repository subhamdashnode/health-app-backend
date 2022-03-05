const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = "subhamdash";
const fetchuser=require('../middleware/jwt');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

//Route:1 for create user using post request /api/user/insert Login-Required
router.post('/createuser', [
    body('email', 'email should not empty').isEmail(),
    body('phone_number', 'phone number should be atleast 10 character').isLength({ min: 1, max: 10 }),
    body('password', 'password must be five charcter').isLength({ min: 4 })
], async (req, res) => {
    //if there are no errors ,return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check the user with this email exits or not
        let checkEmail = await User.findOne({ email: req.body.email });
        let checkPhone = await User.findOne({ phone_number: req.body.phone_number });
        if (checkEmail || checkPhone) {
            return res.status(400).send('Please enter correct creadentials');
        }
        const salt=await bcrypt.genSalt(10);
        let secPass=await bcrypt.hash(req.body.password,salt);

        let user = await User.create({
            name: req.body.name ,
            email: req.body.email,
            phone_number: req.body.phone_number,
            gender: req.body.gender,
            date_of_birth: req.body.date_of_birth,
            password: secPass,
            specialization: req.body.specialization,
            pincode: req.body.pincode,
            state: req.body.state,
            city: req.body.city
        })
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({ authToken});
    } catch (error) {
        return res.status(500).send(error.message);
    }
});
//Route:2 using post request User-Login  api/user/login   Login-Required
router.post('/login',[
    body('email', 'email should not empty').isEmail(),
    body('password', 'password must be five charcter').isLength({ min: 4 })
],async(req,res)=>{
    //if there are no errors ,return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).send('please enter correct credentials');
        }
        let passwordCompire=await bcrypt.compare(password,user.password);
        if(!passwordCompire){
            return res.status(400).send('please enter correct credentials');
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({ authToken});
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
})
//Route:3 using get request get the user details  /api/user/getuser  Login-Required
router.get('/getuser',fetchuser,async(req,res)=>{
    try {
        let checkDetails=await User.findOne({_id:req.user.id}).select('-password');
        if(!checkDetails){
            return res.status(400).send('Not found')
        }
        if(checkDetails._id.toString() !== req.user.id){
            return res.status(401).send('Not Allowed');
        }
        res.json({yourdetails:checkDetails})
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});
module.exports = router;