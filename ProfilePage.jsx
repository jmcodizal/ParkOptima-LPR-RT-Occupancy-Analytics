import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '' });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('parkoptima_session'));
    if (!session) return navigate('/');
    setUser(session);
    setFormData({ fullName: session.fullName, email: session.email, phoneNumber: session.phoneNumber || '' });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const session = JSON.parse(localStorage.getItem('parkoptima_session'));
      const response = await axios.put(
        `http://localhost:8000/api/users/${user.user_id}`,
        {
          full_name: formData.fullName,
          email: formData.email
        },
        {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        }
      );
      
      if (response.status === 200) {
        // Update session with new data
        const updatedSession = { ...session, full_name: formData.fullName, email: formData.email };
        localStorage.setItem('parkoptima_session', JSON.stringify(updatedSession));
        alert('Profile updated successfully!');
        navigate(-1);
      }
    } catch (err) {
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#2D4A8F]">User Profile Management</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F]"
            />
          </div>
          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 bg-[#2D4A8F] text-white py-3 rounded-lg font-bold">
              Save Changes
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;