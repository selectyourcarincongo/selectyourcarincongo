import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Congo Auto</h3>
            <p className="text-gray-400">
              The leading vehicle marketplace in Republic of Congo.
              Buy and sell vehicles with confidence.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/vehicles" className="text-gray-400 hover:text-white transition">Browse Vehicles</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition">Register</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Brazzaville, Republic of Congo</p>
            <p className="text-gray-400 mt-2">Payment: +242 068 913 333</p>
            <p className="text-gray-400">Merchant Code: 374575</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Congo Auto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;