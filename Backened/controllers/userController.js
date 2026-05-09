import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"
import transporter from "../config/email.js";

//login user
const loginUser=async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }
        if(user && !user.isVerified){
            return res.json({success:false,message:"Account not verified"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        const role = user.role;
        const token = createToken(user._id);
        res.json({success:true,token,role,message:"Login successfully"})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
//Register user
const registerUser=async(req,res)=>{
    const frontened_url = "http://localhost:5173"
    const {name,password,email} = req.body;
    try{
        //checking is user already exist
        let user = await userModel.findOne({email});

        if(user && user.isVerified){
            return res.json({success:false,message:"User already registered with this email"})
        }

        //validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        //hashing user password
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1d'})
        const verifyLink = `${frontened_url}/verify-email?token=${token}`
        
        if(user){
            user.name=name,
            user.password=hashedPassword,
            user.verificationToken=token
            await user.save()
        }else{
            user = await userModel.create({name,email,password:hashedPassword,verificationToken:token})
        }

        await transporter.sendMail({
            from:'"ACCOUNT VERIFICATION" <process.env.EMAIL_USER>',
            to: email,
            subject: "Verify email",
            html: `<h2>Hi : ${name}</h2>
            <p>Click here to verify your account</p>
            <a href="${verifyLink}" style="padding:10px;background:#4f46e5;color:white;text-decoration:none">Verify Email</a>
            <p>Valid for 24 hours</p>`
        })

        res.json({success:true,message:"Registered successfully.Check your mail to verify"});

    }catch(error){
        console.log({success:false,message:"Error"});
    }
}
const verifyEmail = async(req,res) =>{
    try {
        const {token} = req.body;
        if(!token) return res.json({success:false,message:"unable to verify"})
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findOne({email:decoded.email})

        if(!user) return res.json({success:false,message:"unable to verify"})
        if(user.isVerified) return res.json({success:false,message:"Already verified"})
        if(user.verificationToken!==token) return res.json({success:false,message:"unable to verify"})
        
        user.isVerified = true
        user.verificationToken = ""
        await user.save()

        res.json({success:true,message:"Email verified.You can login now"})
    } catch (error) {
        res.json({success:false,message:"Link expired"})
    }
}
export {loginUser,registerUser,verifyEmail}