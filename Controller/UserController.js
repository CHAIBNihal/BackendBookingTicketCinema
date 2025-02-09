const express = require('express');
const User = require('../DB/Models/User');
const jwt = require('jsonwebtoken');




exports.signUp = async(req, res)=>{
    const {  email, password } = req.body

    // verify if user exist 
    const isNewUser = await User.isThisEmailUsed(email)
    if (!isNewUser) return res.json({ success: false, message: "User is already exist log in your account " });
    // else create new user 
    const user = await User({
      email,
      password
    });
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
    const userInfos = {
      _id : user._id,
      email: user.email,
     
    }
    // save it at database 
    await user.save()
    // formate data at json 
   return res.status(200).json({
    success : true,
    user : userInfos,
    token
   })
}

exports.login =async(req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email});

    if(!user) return res.json({status : 400, message : "User Not found", success : false});

    const isCompared = await user.comparePassword(password)
    if(!isCompared) return res.json({message : "Password or email is invalid"})

    const token = jwt.sign({userId : user._id}, process.env.SECRET_KEY,{expiresIn : "1d"})

    const userInfos = {
        _id : user._id,
        email : user.email
    }
    return res.json({status : 200, message : "user is login", user : userInfos, token, success : true})
}




