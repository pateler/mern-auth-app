/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 hidden sm:block">
                EcomDash
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Orders
              </Link>
              <Link
                to="#"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Products
              </Link>
              <Link
                to="#"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                Analytics
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600"
              >
                Orders
              </Link>
              <Link
                to="#"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600"
              >
                Products
              </Link>
              <Link
                to="#"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600"
              >
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2026 EcomDash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
