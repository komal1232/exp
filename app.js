const express=require('express')
const app=express()  
const PORT = process.env.PORT || 5000
const mongoose =require('mongoose')
const { MONGOURI}=require('./config/keys')

mongoose.connect(MONGOURI,{ useNewUrlParser: true,useUnifiedTopology: true} )
mongoose.connection.on('connected',()=>{
    console.log("yes database connected");
})
mongoose.connection.on('error',(err)=>{
    console.log("database not connected",err);
})

require('./models/User')
require('./models/post')
app.use(express.json()) //arrangeent is imp
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
if(process.env.NODE_ENV=="production"){
    app.use(express.static('clientp/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'clientp','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log("server is on ",PORT)
})