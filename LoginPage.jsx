import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import logo from './logo.png';

const USERS = [
  { email: "owner@parkoptima.com", password: "Owner@2025", role: "owner", fullName: "System Owner" },
  { email: "attendant@parkoptima.com", password: "Attendant@2025", role: "attendant", fullName: "System Attendant" }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Owner'); 
  const [email, setEmail] = useState(localStorage.getItem('parkoptima_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('parkoptima_remembered_email'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password Reset States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState({ text: '', type: '' });

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetMessage({ text: '', type: '' });

    const registeredUsers = JSON.parse(localStorage.getItem('parkoptima_users') || '[]');
    const allUsers = [...USERS, ...registeredUsers];
    
    const userExists = allUsers.some(u => u.email.toLowerCase() === resetEmail.toLowerCase());

    if (userExists) {
      setResetMessage({ text: "Reset link sent! Check your email.", type: 'success' });
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail('');
        setResetMessage({ text: '', type: '' });
      }, 2000);
    } else {
      setResetMessage({ text: "Email not found. Please try again.", type: 'error' });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate network delay
    setTimeout(() => {
      const targetRole = role.toLowerCase();
      // Check hardcoded users + any registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('parkoptima_users') || '[]');
      const allUsers = [...USERS, ...registeredUsers];

      const user = allUsers.find(u => u.email === email && u.password === password);

      if (user) {
        if (user.role !== targetRole) {
          setError(`This account is not registered as ${role}`);
          setLoading(false);
        } else {
          if (rememberMe) {
            localStorage.setItem('parkoptima_remembered_email', email);
          } else {
            localStorage.removeItem('parkoptima_remembered_email');
          }

          setSuccess('Sign in successful! Redirecting...');
          localStorage.setItem('parkoptima_session', JSON.stringify({
            ...user,
            isLoggedIn: true,
            loginTime: Date.now()
          }));
          
          setTimeout(() => {
            if (user.role === 'owner') navigate('/owner/dashboard');
            else if (user.role === 'attendant') navigate('/attendant/dashboard');
            else navigate('/');
          }, 1500);
        }
      } else {
        setError('Invalid email or password.');
      }
      
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#2D4A8F] p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <img src={logo} alt="ParkOptima Logo" className="w-8 h-8 mr-2" />
          <span className="text-white text-xl font-bold">ParkOptima</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          {/* Large Logo */}
          <div className="mb-6">
            <img src={logo} alt="ParkOptima Logo" className="w-16 h-16 mx-auto" />
          </div>

          {/* Role Selection Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            {['Owner', 'Attendant', 'Vehicle Owner'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setRole(tab);
                  setError('');
                }}
                className={`flex-1 py-2 text-sm font-bold transition-all duration-200 rounded-md ${
                  role === tab
                    ? 'bg-[#2D4A8F] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg text-center font-medium animate-pulse">
              {success}
            </div>
          )}

          {role === 'Vehicle Owner' ? (
            /* Vehicle Owner Layout */
            <div className="space-y-6">
              <div className="border-2 border-[#4DB6AC] bg-teal-50 p-6 rounded-xl text-center">
                <h2 className="text-[#4DB6AC] font-extrabold text-lg mb-1">Welcome, Vehicle Owner!</h2>
                <p className="text-gray-600 text-sm">Access your parking account or create a new one</p>
              </div>
              <button className="w-full bg-[#2D4A8F] text-white py-3 rounded-lg font-bold hover:bg-[#243b72] transition-colors shadow-md">
                Check Balance
              </button>
            </div>
          ) : (
            /* Owner & Attendant Form */
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="email@parkoptima.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2D4A8F] focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2D4A8F] focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2D4A8F] focus:ring-[#2D4A8F] mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D4A8F] text-white py-3 rounded-lg font-bold hover:bg-[#243b72] transition-colors shadow-md flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="flex flex-col gap-2 text-center text-sm">
                <Link to="/register/owner" className="text-[#4DB6AC] hover:underline">
                  Register as Parking Owner
                </Link>
                <Link to="/register/attendant" className="text-[#4DB6AC] hover:underline">
                  Register as Parking Attendant
                </Link>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[#2D4A8F] text-sm hover:underline"
                >
                  Forgot password? Reset here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowResetModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#2D4A8F] p-4 flex justify-between items-center">
              <h3 className="text-white font-bold">Password Reset</h3>
              <button 
                onClick={() => setShowResetModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">
                Enter your email address and we'll help you recover your password.
              </p>

              {resetMessage.text && (
                <div className={`mb-4 p-3 text-sm rounded border ${
                  resetMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {resetMessage.text}
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D4A8F] focus:border-transparent outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-[#2D4A8F] text-white py-3 rounded-lg font-bold hover:bg-[#243b72] transition-colors shadow-md"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;