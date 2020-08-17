const jwt=require('jsonwebtoken')
const {JWT_SECRETE}=require('../config/keys')
const mongoose=require('mongoose')
const User=mongoose.model("User")
module.exports =(req,res,next)=>{
    const {authorization}=req.headers
    //authorization = == Bearer token
    if(!authorization)
    return res.status(422).json({error:"must be logged in"})
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRETE,(err,payload)=>{
        if(err){
        return res.status(401).json({error:"must be logged in"})
        }
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })
        //next() if we call next here then we will get req,user undefined coz it takes time to fill the data
    })

}