const express=require("express")
const router =express.Router()
const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')
const User= mongoose.model("User")
const Post= mongoose.model("Post")
const jwt=require('jsonwebtoken')
const {JWT_SECRETE}=require('../config/keys')
const requireLogin=require('../middleware/requirelogin')
const requirelogin = require("../middleware/requirelogin")
router.post('/search-users',(req,res)=>{
    let userPattern= new RegExp("^" +req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email name")
    .then(user=>{
        res.json({user})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })


    })
    .catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})
router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{folloers:req.user._id}
    },{ new :true
    },(err,result)=>{
        if(err){

            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        } ,{new:true})
        .select("-password")
        .then(result=>{
            console.log(result)
            res.json(result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{folloers:req.user._id}
    },{ new :true
    },(err,result)=>{
        if(err){

            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        } ,{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})
router.put('/updatepic',requirelogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:"pic cannot posy"})
        }
        res.json(result)
    })
})
module.exports =router