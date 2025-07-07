import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaUserPlus } from "react-icons/fa";
import { iconClass } from "../../assets/dummyData";

const Login = ({ handleLoginSuccess, onClose }) => {
const [showToast, setShowToast] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({ username: "", password: "", rememberMe: false });

useEffect(() => {
const stored = localStorage.getItem("loginData");
if (stored) setFormData(JSON.parse(stored));
}, []);

const handleSubmit = (e) => {
e.preventDefault();
formData.rememberMe ? localStorage.setItem("loginData", JSON.stringify(formData)) : localStorage.removeItem("loginData");
setShowToast(true);
setTimeout(() => setShowToast(false), 3000);
if (handleLoginSuccess) handleLoginSuccess();
};

const handleChange = ({ target: { name, value, type, checked } }) => {
setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
};

const toggleShowPassword = () => setShowPassword((prev) => !prev);

return (
<div className="space-y-6 relative">
<div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}>
<div className="bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm">
<FaCheckCircle className="flex-shrink-0" />
<span>Login Successful</span>
</div>
</div>
<form onSubmit={handleSubmit} className="space-y-6">
<div className="relative">
<FaUser className={iconClass} />
<input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="pl-10 pr-4 py-3 border rounded w-full focus:outline-none" />
</div>
<div className="relative">
<FaLock className={iconClass} />
<input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="pl-10 pr-4 py-3 border rounded w-full focus:outline-none" />
<button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400">
{showPassword ? <FaEyeSlash /> : <FaEye />}
</button>
</div>
<label className="flex items-center">
<input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="focus:ring-amber-600 h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded" />
<span className="ml-2 text-amber-100 text-sm">Remember me</span>
</label>
<button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded flex items-center justify-center gap-2 hover:scale-105 transition-transform">
Sign In <FaArrowRight />
</button>
</form>
<div className="text-center">
<Link to="/signup" onClick={onClose} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors">
<FaUserPlus /> Create New Account
</Link>
</div>
</div>
);
};

export default Login;
