import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Alumini</Link>
      </div>
      <div className="hidden md:flex space-x-8">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/directory" className="text-gray-700 hover:text-blue-600">Directory</Link>
        <Link to="/events" className="text-gray-700 hover:text-blue-600">Events</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;