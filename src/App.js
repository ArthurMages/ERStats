import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import CharacterStats from './pages/CharacterStats';
import Unions from './pages/Unions';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <nav className="bg-black/95 backdrop-blur-md border-b border-red-900/50 sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg border border-red-500/30">
                <span className="text-white font-bold text-lg">ER</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Stats
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/" className="px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all font-medium">
                Accueil
              </Link>
              <Link to="/rankings" className="px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all font-medium">
                Classements
              </Link>
              <Link to="/characters" className="px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all font-medium">
                Statistiques
              </Link>
              <Link to="/unions" className="px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all font-medium">
                Unions
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-red-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-red-900/50">
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/" className="text-gray-300 hover:text-red-400 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to="/rankings" className="text-gray-300 hover:text-red-400 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Classements
                </Link>
                <Link to="/characters" className="text-gray-300 hover:text-red-400 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Statistiques
                </Link>
                <Link to="/unions" className="text-gray-300 hover:text-red-400 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Unions
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:nickname" element={<Home />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/characters" element={<CharacterStats />} />
        <Route path="/unions" element={<Unions />} />
      </Routes>
    </Router>
  );
}

export default App;
