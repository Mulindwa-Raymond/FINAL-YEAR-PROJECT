import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MachineTypeSelection from './pages/MachineTypeSelection';
import SiteTaskProfile from './pages/SiteTaskProfile';
import RecommendationResults from './pages/RecommendationResults';
import History from './pages/History';
import Training from './pages/Training';
import About from './pages/About';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { AdminLogin } from './pages/admin/AdminLogin';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Something went wrong</h1>
            <p className="text-slate-500 mb-6">An error occurred while loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Navbar />}
        
        {isAdminRoute ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminRoutes />
                </PrivateRoute>
              }
            />
          </Routes>
        ) : (
          <main className="flex-grow pt-20 min-h-0">
            <Routes>
              {/* Public Routes - Accessible to everyone */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/training" element={<Training />} />
              <Route path="/about" element={<About />} />
              <Route path="/machine-type" element={<MachineTypeSelection />} />
              <Route path="/site-task-profile" element={<SiteTaskProfile />} />
              <Route path="/recommendation-results" element={<RecommendationResults />} />
              <Route path="/recommendation-details" element={<Details />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        )}
        
        {!isAdminRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;