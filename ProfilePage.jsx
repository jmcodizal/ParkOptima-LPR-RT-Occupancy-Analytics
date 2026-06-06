import React, { useState, useEffect } from 'react';
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

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    
    // Update session
    localStorage.setItem('parkoptima_session', JSON.stringify(updatedUser));
    
    // Update persistent user list if not a hardcoded user
    const users = JSON.parse(localStorage.getItem('parkoptima_users') || '[]');
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('parkoptima_users', JSON.stringify(users));
    }

    alert('Profile updated successfully!');
    navigate(-1);
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