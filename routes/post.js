const express=require("express")
const router =express.Router()
const mongoose =require('mongoose')
const Post =mongoose.model("Post")
const requireLogin=require('../middleware/requirelogin')
router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body
    if(!title || !body || !pic){
    return res.status(422).json({error:"please complete post"})
    }
    console.log(req.user)
    //res.send("ok")

    req.user.password=undefined
    const post1 =new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post1.save().then(result=>{
        res.json({post:result})

    })
    .catch(err=>{
        console.log(err)
    })

})
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{

        $push:{likes:req.user._id}
    },{new:true})
    .exec((err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        else{
        res.json({result})
        }
    })

})
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{

        $push:{comments:comment}
    },{new:true})
    .populate("comments.postedBy","_id name")
    //.populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        else{
        res.json({result})
        }
    })

})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true})
    .exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else
        res.json({result})
    })

})
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.to_String === req.user._id.to_String){
            post.remove()
            .then(result=>{
                res.json({res})
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})
module.exports=router