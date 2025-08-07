import express,  { Response } from 'express';
import cors from 'cors';
import { connectDB, employee, login } from './db';
import { Request } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

class AuthController {

    // Siignup
    static signUp = async (req: Request, res: Response) => {
  const { f_userName, f_Pwd } = req.body;
  const existing = await login.findOne({ f_userName });
  if (existing) return res.status(409).json({ message: 'User already exists' });
  const user = new login({ f_userName, f_Pwd });
  await user.save();
  res.status(201).json({ message: 'User created' });
};


    // login
  static login = async (req: Request, res: Response) => {
  const { f_userName, f_Pwd } = req.body;

  const user = await login.findOne({ f_userName });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (user.f_Pwd !== f_Pwd) {
    return res.status(401).json({ success: false, message: "Incorrect password" });
  }

  return res.status(200).json({ success: true, message: "Login successful" });
};

    // employee
    static employee = async (req: Request, res: Response) => {
        const { f_Image, f_Name, f_Email, f_Designation} =  req.body;
        const employeeDate = await employee.create(req.body);
        if(!employeeDate) return res.status(411).json({message: "Employee already exists"});
        res.status(200).json({message: "Employee created successfully"});
    }
    // get employee
    static getEmployee = async  (req: Request, res: Response) => {
        const allEmplpyee = await employee.find();
        res.json({Employees: allEmplpyee});
    }

    // update employee 
static updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updated = await employee.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee updated successfully", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


    // delete employee
    static deleteEmployee = async (req: Request, res: Response) => {
        const { id } = req.params;
        await employee.findByIdAndDelete(id);;
        res.status(200).json({message: "Employee deleted successfully"});
    }
}

connectDB();

app.post('/api/signup', AuthController.signUp);
app.post('/api/login', AuthController.login);
app.post('/api/employees', AuthController.employee);
app.get('/api/employees', AuthController.getEmployee);
app.put('/api/employees/:id', AuthController.updateEmployee);
app.delete('/api/employees/:id', AuthController.deleteEmployee);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
