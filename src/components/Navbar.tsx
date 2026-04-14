import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', icon: Home, label: 'בית' },
    { to: '/contract', icon: FileText, label: 'הזמנה' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600
                           flex items-center justify-center group-hover:opacity-90 transition-opacity shadow-md">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">
                וילת הדס
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                חוויית אירוח פרימיום
              </p>
            </div>
            {/* Mobile Logo Text */}
            <h1 className="sm:hidden text-lg font-display font-bold text-gray-900 dark:text-white">
              וילת הדס
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-all
                  ${isActive(to)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-slate-700 transition-all ml-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button & Dark Mode */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all
                    ${isActive(to)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
