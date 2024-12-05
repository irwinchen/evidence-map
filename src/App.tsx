import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import MapPage from './pages/MapPage';
import ContributorsPage from './pages/ContributorsPage';
import SubmitPage from './pages/SubmitPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Header */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">WPTF System Mapper</h1>
              </div>
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  to="/map"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  Map
                </Link>
                <Link
                  to="/contributors"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  Contributors
                </Link>
                <Link
                  to="/submit"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  Submit
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
