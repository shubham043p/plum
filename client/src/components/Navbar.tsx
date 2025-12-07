import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, BrainCircuit, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext!;
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const { theme, toggleTheme } = useTheme();

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors relative overflow-hidden"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Moon size={20} className="text-blue-300" />
          ) : (
            <Sun size={20} className="text-yellow-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );

  const authLinks = (
    <div className="flex items-center space-x-6">
      <ThemeToggle />
      <span className="text-gray-500 dark:text-gray-300">Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user && user.username}</span></span>
      <Link to="/" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
      <Link to="/history" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">History</Link>
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg transition-all"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <Link to="/login" className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link>
      <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-purple-500/30">Sign Up</Link>
    </div>
  );

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BrainCircuit className="text-purple-600 dark:text-purple-500" size={32} />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              AI Quiz
            </span>
          </Link>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
