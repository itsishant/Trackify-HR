import mongoose from "mongoose";
import { MONGO_URI } from "./config"; 

export const connectDB = async () => {
    try{
        const connection = await mongoose.connect(MONGO_URI);
        if(connection) return console.log("Connected to db");
    } catch (error) {
        console.log("Error connecting to db", error);
    }
}

const loginSchema = new mongoose.Schema({
    f_userName: {type: String, require: true, unique: true},
    f_Pwd: {type: String, require: true}
})

const employeeSchema = new mongoose.Schema({
    f_Image: {type: String, require: true},
    f_Name: {type: String, require: true},
    f_Email: {type: String, require: true, unique: true},
    f_Designation: {type: String, require: true},
    f_gender: {type: String, require: true},
    f_course: {type: String, require: true},
    f_CreateAt: {type: Date, default: Date.now} 
})

const login = mongoose.model("login", loginSchema);
const employee = mongoose.model("employee", employeeSchema);

export { login, employee };
