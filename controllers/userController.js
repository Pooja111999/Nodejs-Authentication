const UserModel = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const env = require('dotenv');
// env.config();

class UserController{
    static userRegistration = async(req,res)=>{
        const {name, email, password, password_confirmation, tc} = req.body;
        const user = await UserModel.findOne({email:email});

        if(user){
       res.send({"Status":"Faild", "massage":"email already exist"});
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                  try {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    });

                    await doc.save();
                    console.log(req.body);
                     const saved_user = await UserModel.findOne(
                         {email:email});
                    //     //generate JWT Token
                   console.log(saved_user)
                     const token = jwt.sign({userID:saved_user._id},
                       JWT_SECRET_KEY);

                    res.status(201).send({"Status":"succses", "massage":" registation succses", "token":token});

                  } catch (error) {
                    // console.log(err);
                    res.send({"Status":"Faild", "massage":"Unable to register"})
                  }
                }else{
                    res.send({"Status":"Faild", "massage":"password not match"});
                }

            }else{
                res.send({"Status":"Faild", "massage":"All fields are required"})
            }

        }
    }

    static userLogin = async (req,res)=>{
        try {
            const {email , password} = req.body

            if(email && password){
                const user = await UserModel.findOne({email:email});
                if(user != null){
                 const isMatch = await bcrypt.compare(password,user.password);
                 if((user.email === email) && isMatch){
                     //     //generate JWT Token

                     const token = jwt.sign({userID:user._id},
                        JWT_SECRET_KEY);

                    res.send({"Status":"succes", "massage":"Login succes","token":token}) 

                 }else{
                    res.send({"Status":"Faild", "massage":"Email or password is not valid"}) 
                 }

                }else{
                    res.send({"Status":"Faild", "massage":"You are not a registered user"}) 
                }

            }else{
                res.send({"Status":"Faild", "massage":"All fields are required"}) 
            }

        } catch (error) {
           console.log(error); 
        }
    }


    static changeUserPassword = async (req,res)=>{
        const{password, password_confirmation} = req.body;

        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"Status":"Faild", "massage":"New password or confirm password dosen't match"}) 
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
               //console.log("pooja",req.user._id);
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{password: hashPassword} });
                console.log(req.user._id);
                res.send({"status":"success", "message":"password changed succesfully"})
            }
            
        }else{
            res.send({"Status":"Faild", "massage":"All fields are required"});
        }
    }


    static loggedUser = async(req,res)=>{
        res.send({"user":req.user})
    }

    static sendUserPasswordResetEmail = async(req,res)=>{
        const {email} = req.body;
        if(email){
          const user = await UserModel.findOne({email:email});
          
          if(user){
            console.log(user,"akshay");
            const secret = user._id + JWT_SECRET_KEY;
           const token = jwt.sign({userID: user._id},secret);

           const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
           console.log(link);
           res.send({"status":"success", "message":"password reset Email send.. plzz chk"})
         
          }else{
            res.send({"Status":"Faild", "massage":"Email doesn't exists"});
          }
        }else{
            res.send({"Status":"Faild", "massage":"Email fields is required"});
        }
    }

    static userPasswordReset = async(req,res)=>{
        const {password,password_confirmation} = req.body
        const {id,token} = req.params
       // console.log(id,token,"pihuuuuuuuuuuuuuuuu");
        
        try {
            const user = await UserModel.findById(id)
          const new_secret = user._id + JWT_SECRET_KEY
            jwt.verify(token, new_secret)
            if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"Status":"Faild", "massage":"Password not match"});
            }else{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
                await UserModel.findByIdAndUpdate(user._id,{$set:{password: hashPassword} });
                res.send({"status":"success", "message":"password Reset succesfully"})
                
            }
            }else{
                res.send({"Status":"Faild", "massage":"All fields are required"}); 
            }
        } catch (error) {
            res.send({"Status":"Faild", "massage":"Invalid Token"});
        }
    }


    
}

module.exports = UserController;