import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import CharacterStats from './pages/CharacterStats';
import Unions from './pages/Unions';
import RoutesPage from './pages/Routes';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-black hover:text-red-500 transition-colors">
              ER Stats
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                Accueil
              </Link>
              <Link to="/rankings" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                Classements
              </Link>
              <Link to="/characters" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                Statistiques
              </Link>
              <Link to="/unions" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                Unions
              </Link>
              <Link to="/routes" className="text-gray-600 hover:text-red-500 transition-colors font-medium">
                Itinéraires
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to="/rankings" className="text-gray-600 hover:text-red-500 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Classements
                </Link>
                <Link to="/characters" className="text-gray-600 hover:text-red-500 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Statistiques
                </Link>
                <Link to="/unions" className="text-gray-600 hover:text-red-500 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Unions
                </Link>
                <Link to="/routes" className="text-gray-600 hover:text-red-500 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Itinéraires
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/characters" element={<CharacterStats />} />
        <Route path="/unions" element={<Unions />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
