import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, Info } from 'lucide-react';
import { checkBalance } from './balanceApi';

const CheckBalanceForm = ({ onResult, onNavigateSignup, onBack }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!plateNumber.trim()) return setError('Plate number is required.');
    if (pin.length !== 4) return setError('PIN must be exactly 4 digits.');

    setLoading(true);
    try {
      const response = await checkBalance(plateNumber, pin);
      onResult(response.data);
    } catch (err) {
      setError('No account found. Please check your plate number and PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setPin(val);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md font-sans">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#3DBFA8] rounded-full flex items-center justify-center mb-4">
          <Wallet className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Check Balance</h2>
        <p className="text-gray-500 text-sm text-center">
          Enter your plate number and PIN to view your balance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
          <input
            type="text"
            placeholder="ABC 1234"
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#3DBFA8] focus:ring-2 focus:ring-[#3DBFA8]/20 outline-none uppercase"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#3DBFA8] focus:ring-2 focus:ring-[#3DBFA8]/20 outline-none"
              value={pin}
              onChange={handlePinChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2E4A8B] text-white font-bold rounded-xl hover:bg-[#1e3261] transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Balance"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-[#EBF4FF] border-l-4 border-blue-400 rounded-r-xl flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <p className="text-sm text-gray-700">
          Note: If you don't have an account yet, you can{" "}
          <button 
            onClick={onNavigateSignup}
            className="text-[#3DBFA8] font-bold hover:underline"
          >
            sign up here
          </button>{" "}
          or visit an attendant to register your vehicle.
        </p>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={onBack}
          className="text-gray-500 text-sm hover:text-[#2E4A8B] font-medium"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default CheckBalanceForm;