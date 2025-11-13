import { Link, useNavigate } from 'react-router-dom';
import { Code, LogOut, User, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold text-xl">
            <Code className="w-8 h-8" />
            <span>Snippet Manager</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/snippets" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
              <Search className="w-5 h-5" />
              <span>Explore</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/snippets/new"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Snippet</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.username || 'Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
