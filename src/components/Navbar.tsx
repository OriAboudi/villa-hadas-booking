// import { Link, useLocation } from 'react-router-dom';
// import { Home, FileText, Shield, Sun, Moon } from 'lucide-react';
// import { useState, useEffect } from 'react';

// export const Navbar = () => {
//   const location = useLocation();
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const isDark = localStorage.getItem('theme') === 'dark';
//     setDarkMode(isDark);
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     if (newMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 
//                            flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//               <Home className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-display font-bold text-gradient">וילת הדס</h1>
//               <p className="text-xs text-slate-600 dark:text-slate-400">חוויית אירוח פרימיום</p>
//             </div>
//           </Link>

//           {/* Navigation Links */}
//           <div className="flex items-center gap-2">
//             <Link
//               to="/"
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all
//                 ${isActive('/') 
//                   ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
//                   : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
//             >
//               <Home size={18} />
//               <span>בית</span>
//             </Link>

//             <Link
//               to="/contract"
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all
//                 ${isActive('/contract') 
//                   ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
//                   : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
//             >
//               <FileText size={18} />
//               <span>הזמנה</span>
//             </Link>

//             <Link
//               to="/admin"
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all
//                 ${isActive('/admin') 
//                   ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
//                   : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
//             >
//               <Shield size={18} />
//               <span>ניהול</span>
//             </Link>

//             {/* Dark Mode Toggle */}
//             <button
//               onClick={toggleDarkMode}
//               className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 
//                        hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-700" />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };



import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Shield, Sun, Moon, Menu, X } from 'lucide-react';
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
    { to: '/admin', icon: Shield, label: 'ניהול' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
                    border-b border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 
                           flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
                וילת הדס
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">
                חוויית אירוח פרימיום
              </p>
            </div>
            {/* Mobile Logo Text */}
            <h1 className="sm:hidden text-lg font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                         bg-clip-text text-transparent">
              וילת הדס
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all
                  ${isActive(to) 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-slate-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button & Dark Mode */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu size={24} className="text-slate-700 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all
                    ${isActive(to) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
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