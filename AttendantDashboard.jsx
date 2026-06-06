import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.png';
import { 
  LogOut, 
  LayoutDashboard, 
  Car, 
  Camera,
  ArrowRightCircle, 
  AlertTriangle,
  ClipboardList, 
  UserCircle,
  Activity
} from 'lucide-react';

const AttendantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    fullName: 'Parking Attendant',
    email: 'attendant@parkoptima.com',
    image: null
  });

  const session = JSON.parse(localStorage.getItem('parkoptima_session') || '{}');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('parkoptima_transactions') || '[]');
    setTransactions(stored);

    // Load profile from local storage
    const storedProfile = JSON.parse(localStorage.getItem('parkoptima_attendant_profile'));
    if (storedProfile) setProfile(storedProfile);

    // Authentication Protection & Session Expiry (8 Hours)
    const session = JSON.parse(localStorage.getItem('parkoptima_session'));
    if (!session || !session.isLoggedIn) {
      navigate('/', { state: { message: "Please login to continue" } });
    } else if (session.role !== 'attendant') {
      navigate(session.role === 'owner' ? '/owner/dashboard' : '/', { state: { message: "Access denied" } });
    } else {
      const eightHours = 8 * 60 * 60 * 1000;
      if (Date.now() - session.loginTime > eightHours) {
        handleLogout();
      } else {
        setAuthLoading(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfile = { ...profile, image: reader.result };
        setProfile(updatedProfile);
        localStorage.setItem('parkoptima_attendant_profile', JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentlyParkedCount = transactions.filter(t => t.exit === null).length;
  const transactionsTodayCount = transactions.length;
  const pendingPaymentsCount = transactions.filter(t => t.status === 'Unpaid').length;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const totalSlots = 24;

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F0F2F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2D4A8F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F2F5]">
        {/* Sidebar */}
        <aside className="w-60 h-screen fixed left-0 top-0 overflow-hidden flex flex-col bg-[#2D4A8F] text-white z-30">
          <div className="flex-grow overflow-hidden p-3 space-y-2">
            <section>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Main</p>
              <nav className="space-y-1">
                {[
                  { name: 'Overview', icon: LayoutDashboard },
                  { name: 'Vehicle Entry', icon: Car },
                  { name: 'Vehicle Exit', icon: ArrowRightCircle },
                  { name: 'Transaction Log', icon: ClipboardList }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.name 
                        ? 'bg-white/15 shadow-inner translate-x-1' 
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >{activeTab === item.name && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
                    <item.icon size={18} /> {item.name}
                  </button>
                ))}
              </nav>
            </section>

            <section>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">My Account</p>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('Profile')}
                  className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Profile' ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  <UserCircle size={18}/> Account Settings
                </button>
              </nav>
            </section>
          </div>

          <div className="p-3 mt-auto border-t border-white/10 space-y-2">
            <div className="px-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{profile.email}</p>
            </div>
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="w-full flex items-center gap-3 text-red-500 hover:text-red-400 p-2 rounded-lg transition-colors hover:bg-white/5 text-sm font-bold"
            >
              <LogOut size={20}/> Log Out
            </button>
          </div>
        </aside>

        {/* Main Content - scrollable, sidebar stays fixed */}
        <main className="ml-60 flex-1 h-screen overflow-y-auto bg-[#F0F2F5]">
          {/* Top Navbar */}
          <header className="sticky top-0 h-16 bg-[#2D4A8F] border-b border-white/10 px-8 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ParkOptima Logo" className="w-8 h-8" />
              <div className="flex items-center text-white">
                <span className="font-bold text-xl tracking-tight">ParkOptima</span>
                <span className="mx-3 text-white/30 font-light">/</span>
                <span className="text-sm font-medium text-white/80">{activeTab}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('Profile')}
                className="flex items-center gap-3 text-white hover:text-teal-300 transition-colors outline-none group"
                title="My Profile"
              >
                <span className="text-sm font-medium hidden md:block group-hover:underline">{profile.fullName}</span>
                {profile.image ? (
                  <img src={profile.image} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                ) : (
                  <UserCircle className="text-white" size={32} />
                )}
              </button>
            </div>
          </header>

          <div className="p-10">
          {activeTab === 'Overview' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              {/* Greeting */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Good morning, Attendant</h2>
                <p className="text-gray-500 text-sm">{currentDate}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Vehicles Parked Now', value: currentlyParkedCount, color: '#2D4A8F' },
                  { label: 'Transactions Today', value: transactionsTodayCount, color: '#10B981' },
                  { label: 'Pending Payments', value: pendingPaymentsCount, color: '#F59E0B' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Visual Grid */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-gray-800 text-lg">Active Parking Slots</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-[#2D4A8F]"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                  {[...Array(totalSlots)].map((_, i) => {
                    const isOccupied = i < currentlyParkedCount;
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all duration-300 ${
                          isOccupied 
                            ? 'bg-[#2D4A8F] border-[#2D4A8F] text-white shadow-md' 
                            : 'bg-gray-50 border-gray-100 text-gray-300'
                        }`}
                      >
                        <span className={`text-[10px] font-bold mb-1 ${isOccupied ? 'text-white/70' : 'text-gray-400'}`}>S{i + 1}</span>
                        {isOccupied ? <Car size={16} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Recent Activity</h3>
                  <Activity size={18} className="text-[#4DB6AC]" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plate Number</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Type</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.length > 0 ? (
                        transactions.slice(-5).reverse().map(t => (
                          <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-gray-800">{t.plateNumber}</td>
                            <td className="px-6 py-4 text-xs text-gray-600">{t.type}</td>
                            <td className="px-6 py-4 text-xs text-gray-600">{t.entry}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                t.status === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                              }`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-400 italic">No recent activity recorded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "Profile" ? (
            <div className="animate-in fade-in duration-500 max-w-4xl">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Picture Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner flex items-center justify-center bg-gray-100">
                      {profile.image ? (
                        <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={80} className="text-gray-300" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-[#2D4A8F] text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <h3 className="font-bold text-gray-800">{profile.fullName}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Parking Attendant</p>
                </div>

                {/* Basic Info Card */}
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-6">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#2D4A8F] transition-all text-sm"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#2D4A8F] transition-all text-sm"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t flex justify-end">
                    <button 
                      onClick={() => {
                        localStorage.setItem('parkoptima_attendant_profile', JSON.stringify(profile));
                        alert('Profile updated successfully!');
                      }}
                      className="px-6 py-2 bg-[#2D4A8F] text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-dashed border-gray-300 animate-in zoom-in-95 duration-500">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Activity className="text-gray-300" size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">{activeTab} Section</h2>
              <p className="text-gray-400 text-sm mt-2 font-medium italic">Functionality arriving in the next update</p>
            </div>
          )}
          </div>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Out</h3>
                <p className="text-gray-500 text-sm mb-8">Are you sure you want to log out of ParkOptima?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
                    Yes, Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
};
export default AttendantDashboard;