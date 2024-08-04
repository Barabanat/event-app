import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side password strength validation
    if (!isPasswordStrong(formData.password)) {
      setError('Password is too weak. It should be at least 8 characters long, contain upper and lower case letters, numbers, and special characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, username: formData.username.toLowerCase() }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User registered successfully');
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed');
    }
    setLoading(false);
  };

  const isPasswordStrong = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1D1C1] to-[#073B4C] flex items-center justify-center py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#073B4C] text-center">User Registration</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Enter your username" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input 
              type="text" 
              name="phoneNumber"
              value={formData.phoneNumber} 
              onChange={handleChange} 
              placeholder="Enter your phone number" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Enter your address" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button 
            type="submit" 
            className={`w-full bg-[#073B4C] text-white py-2 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#065A60] transition duration-200'}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-2 bg-[#F9C74F] text-white py-2 px-4 rounded-md hover:bg-[#F9844A] transition duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
