import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';

const API_BASE = 'https://trackify-hr.onrender.com';

interface Employee {
  _id?: string;
  f_userName?: string;
  f_Pwd?: string;
  f_Name?: string;
  f_Email?: string;
  f_Mobile?: string;
  f_Designation?: string;
  f_gender?: string;
  f_Course?: string[];
  f_Image?: string;
}

function LoginPage() {
  const [form, setForm] = useState<Employee>({});
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post<{ success: boolean }>(`${API_BASE}/api/login`, form);
      if (res.data?.success) {
        localStorage.setItem('user', form.f_userName || '');
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder='Username' onChange={e => setForm({ ...form, f_userName: e.target.value })} /><br />
      <input placeholder='Password' type='password' onChange={e => setForm({ ...form, f_Pwd: e.target.value })} /><br />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

function SignupPage() {
  const [form, setForm] = useState<Employee>({});
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(`${API_BASE}/api/signup`, form);
      alert('User registered successfully');
      navigate('/login');
    } catch {
      alert('Username already exists or another error occurred.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder='Username' onChange={e => setForm({ ...form, f_userName: e.target.value })} /><br />
      <input placeholder='Password' type='password' onChange={e => setForm({ ...form, f_Pwd: e.target.value })} /><br />
      <button onClick={handleSignup}>Sign up</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Employee>({});
  const navigate = useNavigate();

  const loadEmployees = async () => {
    try {
      const res = await axios.get<{ Employees: Employee[] }>(`${API_BASE}/api/employees`);
      setEmployees(res.data.Employees);
    } catch {
      alert("Could not fetch employee data.");
    }
  };

  const handleCreate = async () => {
    await axios.post(`${API_BASE}/api/employees`, form);
    loadEmployees();
    setForm({});
  };

  const handleUpdate = async () => {
    try {
      if (form._id) {
        await axios.put(`${API_BASE}/api/employees/${form._id}`, form);
        loadEmployees();
        setForm({});
      }
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/employees/${id}`);
      loadEmployees();
    } catch {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <br /><br />
      <input placeholder='Name' value={form.f_Name || ''} onChange={e => setForm({ ...form, f_Name: e.target.value })} />
      <input placeholder='Email' value={form.f_Email || ''} onChange={e => setForm({ ...form, f_Email: e.target.value })} />
      <input placeholder='Mobile' value={form.f_Mobile || ''} onChange={e => setForm({ ...form, f_Mobile: e.target.value })} />
      <input placeholder='Designation' value={form.f_Designation || ''} onChange={e => setForm({ ...form, f_Designation: e.target.value })} />
      <input placeholder='Gender' value={form.f_gender || ''} onChange={e => setForm({ ...form, f_gender: e.target.value })} />
      <input placeholder='Course (comma separated)' value={form.f_Course?.join(',') || ''} onChange={e => setForm({ ...form, f_Course: e.target.value.split(',') })} />
      <input placeholder='Image URL' value={form.f_Image || ''} onChange={e => setForm({ ...form, f_Image: e.target.value })} />
      <br />
      {form._id ? <button onClick={handleUpdate}>Update</button> : <button onClick={handleCreate}>Submit</button>}
      <hr />
      <h3>Employee List</h3>
      {employees.map(emp => (
        <div key={emp._id}>
          <b>{emp.f_Name}</b> - {emp.f_Email} - {emp.f_Mobile}
          <button onClick={() => setForm(emp)}>Edit</button>
          <button onClick={() => emp._id && handleDelete(emp._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
