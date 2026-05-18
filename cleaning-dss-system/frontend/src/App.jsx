import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Selector from './pages/Selector';
import Recommendation from './pages/Recommendation';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
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

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${!isAdminRoute ? 'pt-32 lg:pt-40' : ''} min-h-0`}>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/machine-type" element={<MachineTypeSelection />} />
          <Route path="/site-task-profile" element={<SiteTaskProfile />} />
          <Route path="/recommendation-results" element={<RecommendationResults />} />
          <Route path="/history" element={<History />} />
          <Route path="/training" element={<Training />} />
          <Route path="/about" element={<About />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/details" element={<Details />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminRoutes />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
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