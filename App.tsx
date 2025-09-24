
import React, { useState, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {isLoggedIn ? <Dashboard /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

export default App;
