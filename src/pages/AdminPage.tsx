import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Eye, EyeOff } from 'lucide-react';
import { AdminTabs } from '../components/admin/AdminTabs';
import { BookingsTab } from '../components/admin/BookingsTab';
import { DealsTab } from '../components/admin/DealsTab';

const ADMIN_PASSWORD = '1234';

export const AdminPage = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'deals' | 'invitations' | 'images'>('bookings');

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('סיסמה שגויה');
      setPassword('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setActiveTab('bookings');
  };

  // ===== LOGIN SCREEN =====
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
                    flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md
                            rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                ממשק ניהול
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                נא להזין סיסמה לכניסה למערכת
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  סיסמה
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-300
                             dark:border-slate-600 bg-white dark:bg-slate-700
                             text-slate-900 dark:text-white
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                             transition-all text-lg"
                    placeholder="הזן סיסמה..."
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400
                             hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-500 text-sm font-medium"
                  >
                    {authError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600
                         text-white font-bold rounded-xl shadow-lg
                         hover:scale-105 hover:shadow-xl
                         transition-all duration-300 text-lg"
              >
                כניסה למערכת
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                מוגן באמצעות אימות מאובטח 🔒
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== MAIN DASHBOARD =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              לוח בקרה
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              ניהול הזמנות, מבצעים, אירועים ותמונות
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3
                     bg-red-500 hover:bg-red-600 text-white rounded-xl
                     transition-colors shadow-lg font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>התנתק</span>
          </button>
        </motion.div>

        {/* Tabs Navigation */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'deals' && <DealsTab />}
          {activeTab === 'invitations' && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                📅 ניהול אירועים - בקרוב...
              </p>
            </div>
          )}
          {activeTab === 'images' && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                🖼️ ניהול תמונות - בקרוב...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
