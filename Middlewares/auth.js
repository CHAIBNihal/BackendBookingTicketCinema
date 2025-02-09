
const jwt = require('jsonwebtoken')
const User = require('../DB/Models/User')


exports.isAuth = async(req, res, next)=>{
    if( req.headers &&req.headers.authorization){
        // console.log(req.headers.authorization)
      const token =   req.headers.authorization.split(' ')[1];
     try {
        const decode =  jwt.verify(token, process.env.SECRET_KEY)
        const isUser = await User.findById(decode.userId) 
        if(!isUser) return  res.json({success : false, message : "Unauthorized acces"});
        req.user = isUser;
        next()
     } catch (error) {
       if(error.name === "JsonWebTokenError") return  res.json({success : false, message : "Unauthorized acces"});
       if(error.name === "TokenExpiredError") return  res.json({success : false, message : "Session is expired try to log in "});
       res.json({success : false, message :"Internal server error "})
    }



    } else{
        res.json({success : false, message : "Unauthorized acces"})
    }

}