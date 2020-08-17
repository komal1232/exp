const express=require("express")
const router =express.Router()
const mongoose =require('mongoose')
const crypto = require('crypto')
const bcrypt=require('bcryptjs')
const User= mongoose.model("User")
const jwt=require('Jsonwebtoken')
const {JWT_SECRETE}=require('../config/keys')
const requireLogin=require('../middleware/requirelogin')
router.post('/signup',(req,res)=>{
    console.log(req.body)
    const { name , email , password ,pic} = req.body
    if(!email || !password || !name){
    console.log("please")
    return res.status(422).json({error:"please fill"})
    }
    User.findOne({email:email})
    .then((x)=>{
        if(x){
            return res.status(422).json({error:"user allready exists with the email"})
        }
            //2nd arg is length of incripted pass mpre length more secure
            bcrypt.hash(password,12)
            .then(hashedPass=>{
                const user = new User({
                    email,
                    password:hashedPass,
                    name,
                    pic
                })
                user.save()
                .then(user=>{
                    
                    res.json({message:"user succesfully saved"})
                    // transporter.sendMail({
                    //     to:"komalbhalerao1232@gmail.com",
                    //     from:"komala.bhalerao358@gmail.com",
                    //     subject:"sgnup suuccesfull",
                    //     html:"<h1> welcom to insta</h1>"
                    // }).then(x=>{
                    //     if(!x)
                    //     console.log({err:x});
                    //     else
                    //     console.log(x);
                    // })

                })
                .catch(err=>{
                    console.log(err)
                })

            })
            
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const { email,password} =req.body
    if(!email  || !password){
        return res.status(422).json({error:"please provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"})

        }
        console.log(savedUser);
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
                const token =jwt.sign({_id:savedUser._id},JWT_SECRETE)
                const { _id,name,email,followers,following,pic }=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})

            }
            else{
                return res.status(422).json({error:"sorryy invalid email or password"})

            }
        })
        .catch(err=>{
            console.log(err);
        })
        
        

    })
})

module.exports=router 