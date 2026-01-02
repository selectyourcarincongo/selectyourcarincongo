import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">S.C.I.C</h3>
            <p className="text-gray-400">
              Select Your Car In Congo - La première marketplace de véhicules en République du Congo.
              Achetez, vendez et louez des véhicules en toute confiance.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Accueil</Link></li>
              <li><Link to="/vehicles" className="text-gray-400 hover:text-white transition">Parcourir les véhicules</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition">Inscription</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Brazzaville, République du Congo</p>
            <p className="text-gray-400 mt-2">Paiement : +242 068 913 333</p>
            <p className="text-gray-400">Code Merchant : 374575</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 S.C.I.C - Select Your Car In Congo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;