import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckBalanceForm from './CheckBalanceForm';
import BalanceResult from './BalanceResult';
import SignUpForm from './SignUpForm';

const CheckBalanceFlow = () => {
  const [view, setView] = useState('form'); // 'form', 'result', 'signup'
  const [accountData, setAccountData] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const handleResult = (data) => {
    setAccountData(data);
    setView('result');
  };

  const handleRegisterSuccess = (msg) => {
    setToast(msg);
    setView('form');
    setTimeout(() => setToast(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      {toast && (
        <div className="fixed top-4 bg-[#3DBFA8] text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-bounce">
          {toast}
        </div>
      )}
      
      {view === 'form' && (
        <CheckBalanceForm onResult={handleResult} onNavigateSignup={() => setView('signup')} onBack={() => navigate('/')} />
      )}
      {view === 'result' && <BalanceResult data={accountData} onCheckAnother={() => setView('form')} />}
      {view === 'signup' && <SignUpForm onBack={() => setView('form')} onRegisterSuccess={handleRegisterSuccess} />}
    </div>
  );
};

export default CheckBalanceFlow;