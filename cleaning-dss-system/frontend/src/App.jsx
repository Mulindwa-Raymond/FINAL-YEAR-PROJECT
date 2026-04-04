import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Selector from './pages/Selector';
import Recommendation from './pages/Recommendation';
import Results from './pages/Results';
import Details from './pages/Details';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import SiteTaskProfile from './pages/SiteTaskProfile';
import RecommendationResults from './pages/RecommendationResults';
import History from './pages/History';
import Training from './pages/Training';
import About from './pages/About';        // <-- new import for About page
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-32 lg:pt-40">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/site-task-profile" element={<SiteTaskProfile />} />
            <Route path="/recommendation-results" element={<RecommendationResults />} />
            <Route path="/history" element={<History />} />
            <Route path="/training" element={<Training />} />
            <Route path="/about" element={<About />} />            {/* <-- new route */}
            <Route path="/selector" element={<Selector />} />
            <Route path="/results" element={<Results />} />
            <Route path="/details" element={<Details />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;