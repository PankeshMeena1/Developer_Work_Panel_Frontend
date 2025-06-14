import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import UpdatesList from './components/Updates/UpdatesList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/ChatBoard/Chatbot';
// import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className={`d-flex ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={`main-content`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="container-fluid p-4">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/updates" element={<ProtectedRoute><UpdatesList /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Chatbot/>
      </div>
    </div>
  );
  
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;