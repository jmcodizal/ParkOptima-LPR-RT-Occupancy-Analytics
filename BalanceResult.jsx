import React from 'react';
import { Wallet } from 'lucide-react';

const BalanceResult = ({ data, onCheckAnother }) => {
  const Row = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 font-semibold text-sm">{value}</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md font-sans">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-[#3DBFA8] rounded-full flex items-center justify-center mb-4">
          <Wallet className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Check Balance</h2>
      </div>

      <div className="bg-[#3DBFA8] rounded-2xl p-6 text-white mb-6 flex flex-col items-center">
        <span className="text-sm opacity-90 mb-1">Available Balance</span>
        <h3 className="text-4xl font-extrabold mb-3">₱{parseFloat(data.balance).toFixed(2)}</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs">
          <Wallet size={14} />
          <span>Prepaid Account</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <Row label="Plate Number" value={data.plateNumber} />
        <Row label="Owner Name" value={data.ownerName} />
        <Row label="Vehicle Type" value={data.vehicleType} />
        <Row label="Registered" value={data.registeredDate} />
      </div>

      <button
        onClick={onCheckAnother}
        className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors mb-6"
      >
        Check Another Account
      </button>

      <div className="p-4 bg-[#EBF4FF] border-l-4 border-blue-400 rounded-r-xl">
        <p className="text-sm text-gray-700">
          <span className="text-[#3DBFA8] font-bold">Need to top up?</span> Visit any attendant with cash to add credits to your account.
        </p>
      </div>
    </div>
  );
};

export default BalanceResult;