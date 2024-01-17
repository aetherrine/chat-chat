import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Chatroom from './pages/Chatroom';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeForm, setActiveForm] = useState<'login' | 'signup' | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/chatapp/check_authentication', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const onSignupSuccess = () => {
    setIsSignedUp(true);
    setTimeout(() => setIsSignedUp(false), 3000);
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'login':
        return <Login onLoginSuccess={onLoginSuccess} />;
      case 'signup':
        return <Signup onSignupSuccess={onSignupSuccess} />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate replace to="/chatroom" />
            ) : (
              <div className="login-signup-container">
                <div className="title">Welcome to the group chatroom!</div>
                <div className="buttons">
                  <button className="button" onClick={() => setActiveForm('login')}>Log In</button>
                  <button className="button" onClick={() => setActiveForm('signup')}>Sign Up</button>
                </div>
                {isSignedUp && (
                  <div className="signup-success-animation">Sign Up Successful!</div>
                )}
                {renderForm()}
              </div>
            )
          } />
          <Route path="/chatroom" element={
            isAuthenticated ? <Chatroom checkAuthentication={checkAuthentication} /> : <Navigate replace to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
