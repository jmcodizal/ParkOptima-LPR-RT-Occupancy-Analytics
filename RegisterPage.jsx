import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from './logo.png';

const RegisterPage = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: ''
  });
  const [error, setError] = useState('');

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.phoneNumber) {
      return setError('All fields are required.');
    }
    if (!validatePassword(formData.password)) {
      return setError('Password must be 8+ chars, with uppercase, number, and special char.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!/^\d+$/.test(formData.phoneNumber)) {
      return setError('Phone number must be numeric only.');
    }

    const newUser = {
      ...formData,
      role: roleType,
      status: 'Active',
      id: Date.now()
    };

    const existing = JSON.parse(localStorage.getItem('parkoptima_users') || '[]');
    localStorage.setItem('parkoptima_users', JSON.stringify([...existing, newUser]));

    alert('Account created successfully!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center text-[#2D4A8F] mb-6 capitalize">
          Register as {roleType}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />
          <button className="w-full bg-[#2D4A8F] text-white py-3 rounded-lg font-bold">Create Account</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link to="/" className="text-[#2D4A8F] font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;