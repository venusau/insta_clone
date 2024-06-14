const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
const mongoose = require("mongoose")
const User = mongoose.model("User")


module.exports=(req, res, next)=>{
    // console.log(`${req}\n${res}\n${next}`)
    // console.log(req.headers,"\n")
    // console.log(req.headers.authorization, "\n", req.body) //--> Just for the purpose of understandind 
    const {authorization}=req.headers
    // authorization === "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
    if (!authorization){
        return res.status(401).json({error:"You must be logged in "})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if (err){
            return res.status(401).json({error:"You must be logged in"})
        }
        // console.log(payload) --> THis was for the understanding 
        const {_id}= payload
        User.findById(_id).then((userdata)=>{
            req.user = userdata
            next()
        }).catch((err)=>{
            console.log(err)
            return res.status(500).json({ error: "Internal server error" });
        }) 
    })

}