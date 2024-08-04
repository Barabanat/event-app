import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-[#073B4C] to-[#0A4F66] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex flex-col items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-[#D1D1C1] transition-colors duration-300">
            Banatcom
          </Link>
          <span className="text-sm font-light text-[#D1D1C1]">Payment Solutions</span>
        </div>
        <nav className="flex items-center">
          <Link to="/" className="flex items-center mx-2 hover:text-[#D1D1C1] transition-colors duration-300">
            <Home size={18} className="mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="flex items-center mx-2 hover:text-[#D1D1C1] transition-colors duration-300">
                <User size={18} className="mr-1" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center mx-2 bg-[#F94144] text-white px-3 py-1 rounded hover:bg-[#FF006E] transition-colors duration-300">
                <LogOut size={18} className="mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center mx-2 bg-[#073B4C] text-white px-3 py-1 rounded hover:bg-[#1D3557] transition-colors duration-300">
                <LogIn size={18} className="mr-1" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link to="/register" className="flex items-center mx-2 bg-[#6AC17B] text-white px-3 py-1 rounded hover:bg-[#054A29] transition-colors duration-300">
                <UserPlus size={18} className="mr-1" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
