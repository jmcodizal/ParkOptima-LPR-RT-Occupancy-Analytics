import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './logo.png';
import { 
  LogOut, 
  LayoutDashboard, 
  BarChart3, 
  Camera,
  FileText, 
  ClipboardList, 
  Users, 
  Settings, 
  ShieldCheck,
  AlertTriangle,
  UserCircle,
  Search,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart,
  Line,
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    fullName: 'Parking Owner',
    email: 'owner@parkoptima.com',
    image: null
  });

  const chartData = [
    { time: '7am', flow: 1 },
    { time: '8am', flow: 1 },
    { time: '9am', flow: 2 },
    { time: '10am', flow: 2 },
    { time: '11am', flow: 0 },
    { time: '12pm', flow: 0 },
    { time: '1pm', flow: 0 },
    { time: '2pm', flow: 0 },
    { time: '3pm', flow: 0 },
    { time: '4pm', flow: 0 },
  ];

  useEffect(() => {
    const sampleTransactions = [
      { id: '006', plateNumber: 'MNO 1122', type: 'Motor', entry: '07:00 AM', exit: '08:00 AM', fee: 5, status: 'Paid' },
      { id: '007', plateNumber: 'PQR 3344', type: '4 Wheels', entry: '06:30 AM', exit: '07:45 AM', fee: 20, status: 'Paid' },
      { id: '004', plateNumber: 'GHI 3456', type: 'Motor', entry: '10:00 AM', exit: '11:30 AM', fee: 5, status: 'Unpaid' },
      { id: '005', plateNumber: 'JKL 7890', type: '4 Wheels', entry: '10:30 AM', exit: '12:00 PM', fee: 20, status: 'Unpaid' },
      { id: '001', plateNumber: 'ABC 1234', type: '4 Wheels', entry: '08:00 AM', exit: null, fee: 20, status: 'Unpaid' },
      { id: '002', plateNumber: 'DEF 5678', type: 'Motor', entry: '09:15 AM', exit: null, fee: 5, status: 'Unpaid' },
      { id: '003', plateNumber: 'XYZ 9999', type: '4 Wheels', entry: '11:00 AM', exit: null, fee: 10, status: 'Unpaid' },
    ];

    const stored = JSON.parse(localStorage.getItem('parkoptima_transactions'));
    if (!stored) {
      localStorage.setItem('parkoptima_transactions', JSON.stringify(sampleTransactions));
      setTransactions(sampleTransactions);
    } else {
      setTransactions(stored);
    }

    // Load users from registration
    const fetchUsers = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('parkoptima_session'));
        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        // Fallback to localStorage if API fails
        const userData = JSON.parse(localStorage.getItem('parkoptima_users') || '[]');
        setUsers(userData);
      }
    };
    fetchUsers();

    // Load profile from local storage
    const storedProfile = JSON.parse(localStorage.getItem('parkoptima_owner_profile'));
    if (storedProfile) setProfile(storedProfile);

    // Authentication Protection & Session Expiry (8 Hours)
    const session = JSON.parse(localStorage.getItem('parkoptima_session'));
    if (!session || !session.isLoggedIn) {
      navigate('/', { state: { message: "Please login to continue" } });
    } else if (session.role !== 'owner') {
      navigate(session.role === 'attendant' ? '/attendant/dashboard' : '/', { state: { message: "Access denied" } });
    } else {
      const eightHours = 8 * 60 * 60 * 1000;
      if (Date.now() - session.loginTime > eightHours) {
        handleLogout();
      } else {
        setAuthLoading(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('parkoptima_session'));
      if (session?.access_token) {
        await axios.post('http://localhost:8000/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('parkoptima_session');
      localStorage.removeItem('parkoptima_remembered_email');
      navigate('/');
    }
  };

  const handleDeleteUser = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('parkoptima_users', JSON.stringify(updated));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedProfile = { ...profile, image: reader.result };
        setProfile(updatedProfile);
        localStorage.setItem('parkoptima_owner_profile', JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalVehicles = transactions.length;
  const currentlyParkedCount = transactions.filter(t => t.exit === null).length;
  const paidRevenue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.fee, 0);
  const unpaidCount = transactions.filter(t => t.status === 'Unpaid').length;
  const pendingRevenue = transactions.filter(t => t.status === 'Unpaid').reduce((sum, t) => sum + t.fee, 0);
  const totalAmount = transactions.reduce((sum, t) => sum + t.fee, 0);
  const collectionRate = totalAmount > 0 ? Math.round((paidRevenue / totalAmount) * 100) : 0;
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const revenueTrendData = [
    { day: 'Mon', revenue: 120 },
    { day: 'Tue', revenue: 150 },
    { day: 'Wed', revenue: 100 },
    { day: 'Thu', revenue: 200 },
    { day: 'Fri', revenue: 180 },
    { day: 'Sat', revenue: 250 },
    { day: 'Sun', revenue: paidRevenue || 25 },
  ];

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
              <button 
                onClick={() => setActiveTab('Overview')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Overview' ? 'bg-white/10' : 'hover:bg-white/5 text-gray-300'}`}
              >{activeTab === 'Overview' && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
                <LayoutDashboard size={18}/> Overview
              </button>
              <button
                onClick={() => setActiveTab('Analytics')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Analytics" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><BarChart3 size={18}/> Analytics</button>
              <button
                onClick={() => setActiveTab('Daily Reports')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Daily Reports" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><FileText size={18}/> Daily Reports</button>
              <button
                onClick={() => setActiveTab('Monthly Reports')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Monthly Reports" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><FileText size={18}/> Monthly Reports</button>
              <button
                onClick={() => setActiveTab('Yearly Reports')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Yearly Reports" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><FileText size={18}/> Yearly Reports</button>
              <button
                onClick={() => setActiveTab('Transaction Log')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Transaction Log" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><ClipboardList size={18}/> Transaction Log</button>
            </nav>
          </section>

          <section>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Management</p>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('User Accounts')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "User Accounts" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><Users size={18}/> User Accounts</button>
              <button
                onClick={() => setActiveTab('System Settings')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "System Settings" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><Settings size={18}/> System Settings</button>
              <button
                onClick={() => setActiveTab('Audit Trail')}
                className={`relative w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "Audit Trail" ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`}
              ><ShieldCheck size={18}/> Audit Trail</button>
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
          <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 text-red-500 hover:text-red-400 p-2 rounded-lg transition-colors hover:bg-white/5 text-sm font-bold">
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
              <span className="font-bold text-xl">ParkOptima</span>
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
                <img src={profile.image} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <UserCircle size={32} />
              )}
            </button>
          </div>
        </header>

        <div className="p-10 space-y-8">
        {activeTab === 'Overview' ? (
          <>
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Good morning, Parking Owner</h2>
          <p className="text-gray-500 text-sm">Today - {currentDate}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Total vehicles today</p>
            <p className="text-2xl font-bold text-gray-800">{totalVehicles} transactions</p>
            <p className="text-[#4DB6AC] text-sm font-semibold mt-2">{currentlyParkedCount} currently parked</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Revenue collected</p>
            <p className="text-2xl font-bold text-[#2D4A8F]">₱{paidRevenue.toFixed(2)}</p>
            <p className="text-[#4DB6AC] text-sm font-semibold mt-2">{collectionRate}% collection rate</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Unpaid vehicles</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{unpaidCount}</p>
            <p className="text-[#F59E0B] text-sm font-semibold mt-2">₱{pendingRevenue.toFixed(2)} pending - Needs attention</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Hourly vehicle flow</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} domain={[0, 2]} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="flow" fill="#2D4A8F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-6">Revenue Summary</h3>
            <div className="space-y-4 flex-grow">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total transactions:</span>
                <span className="font-bold text-gray-800">{totalVehicles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Collected:</span>
                  <span className="font-bold text-[#10B981]">₱{paidRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Uncollected:</span>
                <span className="font-bold text-[#F59E0B]">₱{pendingRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-6 border-t mt-6">
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-[#4DB6AC] h-full transition-all duration-1000" 
                  style={{ width: `${collectionRate}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-bold text-[#4DB6AC] uppercase tracking-wider">
                {collectionRate}% collection rate today
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Transactions</h3>
            <Link to="#" className="text-xs font-bold text-[#2D4A8F] hover:underline uppercase tracking-wider">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plate Number</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exit</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fee</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{t.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-800">{t.plateNumber}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{t.type}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{t.entry}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">{t.exit || '--'}</td>
                    <td className="px-6 py-4 text-xs font-bold text-[#2D4A8F]">₱{t.fee}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === "User Accounts" ? (
          <div className="animate-in fade-in duration-500 space-y-6">
            <header className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">User Account Listing</h1>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    placeholder="Search name or email..."
                    className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#2D4A8F] bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded-lg px-4 py-2 outline-none bg-white text-sm text-gray-600"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owner</option>
                  <option value="attendant">Attendant</option>
                </select>
              </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-medium text-gray-800">{u.fullName}</td>
                      <td className="px-6 py-4 text-xs text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 capitalize">{u.role}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button className="text-[#2D4A8F] text-xs font-bold hover:underline">Edit</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 text-xs font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Parking Owner</p>
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
                      localStorage.setItem('parkoptima_owner_profile', JSON.stringify(profile));
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
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-300">
            <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">{activeTab} Section</h2>
            <p className="text-gray-400 text-sm mt-2 font-medium italic">Under Construction</p>
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
export default OwnerDashboard;