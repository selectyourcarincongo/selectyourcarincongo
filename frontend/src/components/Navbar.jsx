import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { isAuthenticated, isAdmin, logout, getUser } from '@/utils/auth';
import { Car, User, LogOut, LayoutDashboard, Plus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Official S.C.I.C. logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="S.C.I.C - Select Your Car In Congo" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition">
              Accueil
            </Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-primary font-medium transition">
              Véhicules
            </Link>
            {authenticated && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium transition flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {admin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary font-medium transition">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {authenticated ? (
              <>
                {user?.registration_fee_paid && (
                  <Button
                    onClick={() => navigate('/post-vehicle')}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Publier
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user?.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Connexion
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Inscription
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;