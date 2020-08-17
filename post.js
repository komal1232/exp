const express=require("express")
const router =express.Router()
const mongoose =require('mongoose')
//const post =mongoose.model('post')
const requireLogin=require('../middleware/requirelogin')
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo,postBy}=req.body
    if(!title || !body)
    return res.status(422).json({error:"please complete post"})
    console.log(req.user)
    res.send("ok")
    /*const post1 =new post({
        title,
        body,
        postedBy:req.user
    })
    post1.save().then(result=>{
        res.json({post:"result"})

    })
    .catch(err=>{
        console.log(err)
    })
*/

})
module.exports=router