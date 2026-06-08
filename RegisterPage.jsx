import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from './logo.png';

const RegisterPage = () => {
  const { roleType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', confirm_password: '', phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.full_name || !formData.email || !formData.password || !formData.phone_number) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be 8+ chars, with uppercase, number, and special character.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(formData.phone_number)) {
      setError('Phone number must be numeric only.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        phone_number: formData.phone_number,
        role: roleType
      });

      if (response.status === 200) {
        alert('Account created successfully! Please login.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            onChange={e => setFormData({...formData, full_name: e.target.value})}
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
            onChange={e => setFormData({...formData, phone_number: e.target.value})}
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
            onChange={e => setFormData({...formData, confirm_password: e.target.value})}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2D4A8F] text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link to="/" className="text-[#2D4A8F] font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;