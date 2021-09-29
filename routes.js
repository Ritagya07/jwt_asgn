const express = require('express')
const router = express.Router()
const User=require('./model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();
const auth=require('./auth');
const { Model } = require('mongoose');


router.get('/user/info', auth,async(req,res) =>{
    try{
      if(req.user.user_role=="admin"){
        const data= await User.find()
        res.json(data)
    }
  else if(req.user.user_role=="user"){
    
    const data= await User.findById(req.user.user_id)
    res.json(data)
  }}
    catch(err){
        return res.json({ success: false, message: 'No users '} + err)
    }
    
})
router.get('/user/:id/info',auth, async(req,res) => {
    try{
           let data = await User.findById(req.params.id)
         
          
           if(data){
         let responseData={}
         responseData.id=data._id
            responseData.full_name=data.first_name+" "+data.last_name
          responseData.email=data.email_id
          responseData.Gender=data.gender
          responseData.age=data.age
          responseData.Address=data.address
          responseData.CreatedAt=data.createdAt
          responseData.UpdatedAt=data.updatedAt

            return res.status(200).send({ success: true,message:"User Details",data:responseData})            
  
          }
          return res.status(404).send({success:false,message:'User not found for id'+ req.params.id})

    }catch(err){
        return res.status(404).send({success:false,message:err.message })
    }
})

 

router.post("/register",auth,async(req,res) =>{
  try{
    if(req.user.user_role=="admin")
    
    {
      const{first_name,last_name,email_id,password,role,gender,age}=req.body
  
      if(!(email_id && password && role && first_name && last_name && gender && age)){
          return res.status(400).send("All input is required")
      }
  
      const oldUser = await User.findOne({email_id})
  
      if(oldUser){
          return res.status(409).send("User Already Exist: Please Login")
      }
  
      encryptedPassword = await bcrypt.hash(password,10)
  
      const user = await User.create({
          first_name,
          last_name,
          email_id:email_id.toLowerCase(),
          password:encryptedPassword,
          gender,
          role,
          age
      })
  
      return res.status(201).json(user)
  }else{
    return res.status(401).send("No access")
  }}
  
  catch(err){
      console.log(err)
  }
  })
  

  router.post("/login", async (req, res) => {

    try {
      const { email_id, password } = req.body;
  
      if (!(email_id && password)) {
       return res.status(400).send("All input is required");
      }
  
      const user = await User.findOne({ email_id });
  
      if (user && (await bcrypt.compare(password, user.password))) {
  
        const token = jwt.sign(
          { user_id: user._id, email_id,user_role:user.role},
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        user.token = token;
        return res.status(200).json({data:user,Token:token});
      }
      return res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
     });

     
 router.put('/user/:id/update',async(req,res)=> {
     
      Model.findByIdAndUpdate(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        age: req.body.age,
        gender: req.body.gender,
           
        address:{
             
             city:req.body.address.city,
             state:req.body.address.state,
             country:req.body.address.country,
             pincode:req.body.address.pincode
           }
        
      }, 
       {new: true}) 
      
      .then(user => {
       if(!user) {
         return res.status(404).send({success:false,
         message: "user not found with id " + req.params.id
       });
      }
      res.json({success:true,message:'Updated'});
      }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({success:false,
        message: "user not found with id " + req.params.id
      });
      }
      return res.status(500).send({success:false,
        message: "Error updating user with id " + req.params.id
      });
      });
      
    })
      
      
router.delete('/user/:id/delete',auth, async(req,res) => {
    try{ 
      if(req.user.user_role=="admin" && req.user.user_id!=req.params.id){
    console.log("This is admin user and it is deleting another user")
          // const routes = await User.findByIdAndRemove(req.params.id)
           return res.status(200).send({ success: true,message:"deleted"})
    }
  else{
    console.log("This is either admin or user trying to delete himslef")
  }}
    catch(err){
        return res.status(404).send({success:false, message: "User not found with id " + req.params.id})
        
    }
})


module.exports = router