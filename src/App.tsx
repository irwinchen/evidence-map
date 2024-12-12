import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import AboutPage from './pages/AboutPage';
import SystemMapPage from './pages/SystemMapPage';
import ContributorsPage from './pages/ContributorsPage';
import SubmitPage from './pages/SubmitPage';
import ContactPage from './pages/ContactPage';

const MainContent = () => {
  const location = useLocation();
  const isSystemMapPage = location.pathname === '/system-map';

  return (
    <main className={isSystemMapPage ? 'w-full' : 'container mx-auto px-4'}>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/system-map" element={<SystemMapPage />} />
        <Route path="/contributors" element={<ContributorsPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
  );
};

export default function App() {
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
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  to="/system-map"
                  className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-gray-900"
                >
                  System Map
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
                <div className="flex items-center">
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <MainContent />
      </div>
    </BrowserRouter>
  );
}
