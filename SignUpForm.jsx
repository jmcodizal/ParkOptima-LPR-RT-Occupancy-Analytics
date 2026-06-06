import React, { useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { registerAccount } from './balanceApi';

const SignUpForm = ({ onBack, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    vehicleType: 'Motor',
    pin: '',
    confirmPin: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (field, val) => {
    const numericVal = val.replace(/\D/g, '');
    if (numericVal.length <= 4) {
      setFormData({ ...formData, [field]: numericVal });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { plateNumber, ownerName, pin, confirmPin } = formData;
    if (!plateNumber || !ownerName || !pin || !confirmPin) return setError('All fields are required.');
    if (pin !== confirmPin) return setError('PINs do not match.');
    if (pin.length !== 4) return setError('PIN must be exactly 4 digits.');

    setLoading(true);
    try {
      await registerAccount(formData);
      onRegisterSuccess("Account created! You can now check your balance.");
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md font-sans">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#3DBFA8] rounded-full flex items-center justify-center mb-4">
          <Wallet className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <p className="text-gray-500 text-sm text-center">Create your parking account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
          <input
            type="text"
            placeholder="ABC 1234"
            className="w-full p-3 border border-gray-300 rounded-xl outline-none uppercase"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-xl outline-none"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <div className="flex gap-2">
            {['Motor', '4 Wheels'].map((type) => (
              <button
                key={type}
                type="button"
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  formData.vehicleType === type ? 'bg-[#2E4A8B] text-white' : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setFormData({ ...formData, vehicleType: type })}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              placeholder="Enter 4-digit PIN"
              className="w-full p-3 border border-gray-300 rounded-xl outline-none"
              value={formData.pin}
              onChange={(e) => handlePinChange('pin', e.target.value)}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPin(!showPin)}>
              {showPin ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
          <div className="relative">
            <input
              type={showConfirmPin ? "text" : "password"}
              placeholder="Confirm 4-digit PIN"
              className="w-full p-3 border border-gray-300 rounded-xl outline-none"
              value={formData.confirmPin}
              onChange={(e) => handlePinChange('confirmPin', e.target.value)}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPin(!showConfirmPin)}>
              {showConfirmPin ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2E4A8B] text-white font-bold rounded-xl hover:bg-[#1e3261] transition-colors disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 p-4 bg-[#EBF4FF] border-l-4 border-blue-400 rounded-r-xl">
        <p className="text-sm text-gray-700">
          Note: Your PIN will be used to check your balance and manage your account. Keep it secure!
        </p>
      </div>

      <div className="mt-6 text-center">
        <button onClick={onBack} className="text-[#3DBFA8] text-sm font-bold hover:underline">
          Back to Check Balance
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;