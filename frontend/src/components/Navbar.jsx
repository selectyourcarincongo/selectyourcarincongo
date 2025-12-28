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
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_capture-transform/artifacts/p4gyy8n1_E9BD65E7-8936-430E-B951-8B8D3BDE875F.png" 
              alt="Congo Auto" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition">
              Home
            </Link>
            <Link to="/vehicles" className="text-gray-700 hover:text-primary font-medium transition">
              Vehicles
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
                    Post Vehicle
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
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
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