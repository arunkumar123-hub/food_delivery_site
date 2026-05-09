import foodModel from '../models/foodModel.js'
import fs from 'fs'
import userModel from '../models/userModel.js';

//add food item

const addFood = async (req,res) => {
    let image_filename = req.file.filename;
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        let userData = await userModel.findById(req.body.userId);
        if(userData && userData.role=== "admin"){
        await food.save();
        }else{
            res.json({success:false,message:"You are not admin"})
        }
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//all food list
const listFood = async(req,res) =>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

//remove food item
const removeFood = async(req,res) =>{
    try{
        const userData = await userModel.findById(req.body.userId);
        if(userData && userData.role === "admin"){
            const food =await foodModel.findById(req.body.id);
            fs.unlink(`uploads/${food.image}`,()=>{})

            await foodModel.findByIdAndDelete(req.body.id);
            res.json({success:true,message:"Food removed"})
        }else{
            res.json({success:false,message:"You are not admin"})
        } 
    }catch(error){
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

export {addFood,listFood,removeFood}
