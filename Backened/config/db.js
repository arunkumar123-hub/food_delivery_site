import mongoose from "mongoose";
import dns from 'dns/promises'

dns.setServers([
    '1.1.1.1','8.8.8.8'
])


export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
                  console.log("Db connected");
                  
    } catch (error) {
        console.log(error);
        
    }
    
}