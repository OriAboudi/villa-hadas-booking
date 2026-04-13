import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { BookingData } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { getAllBookings } from '../../lib/firebase';

export const BookingsTab = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    totalDeposits: bookings.reduce((sum, b) => sum + b.deposit, 0),
    totalBalance: bookings.reduce((sum, b) => sum + b.balance, 0),
  };

  // Monthly revenue data
  const getMonthlyData = () => {
    const monthlyRevenue: Record<number, number> = {};

    bookings.forEach(booking => {
      const date = new Date(booking.checkIn);
      const month = date.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.totalPrice;
    });

    const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month: monthNames[parseInt(month)],
      revenue,
    }));
  };

  const monthlyData = getMonthlyData();

  // Status distribution
  const statusData = [
    { name: 'מאושר', value: stats.confirmedBookings, color: '#10b981' },
    { name: 'ממתין', value: stats.pendingBookings, color: '#f59e0b' },
    { name: 'בוטל', value: bookings.filter(b => b.status === 'cancelled').length, color: '#ef4444' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'מאושר';
      case 'pending': return 'ממתין לאישור';
      case 'cancelled': return 'בוטל';
      default: return 'לא ידוע';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
        <p className="text-slate-600 dark:text-slate-400">טוען הזמנות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadBookings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadBookings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl
                   hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>רענן</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">סה״כ</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.totalBookings}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">מאושרות</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.confirmedBookings}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">ממתינות</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.pendingBookings}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 shadow-lg text-white col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm opacity-90">הכנסות</span>
          </div>
          <div className="text-3xl font-bold mb-1">{formatCurrency(stats.totalRevenue)}</div>
          <div className="text-xs sm:text-sm opacity-90">סה״כ</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            הכנסות חודשיות
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              אין נתונים להצגה
            </div>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            סטטוס הזמנות
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            הזמנות אחרונות ({bookings.length})
          </h3>
        </div>
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">שם</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">תאריכים</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">אורחים</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">סכום כולל</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300 hidden md:table-cell">יתרה</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {booking.fullName}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {booking.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-sm">
                      <div>{formatDate(booking.checkIn)}</div>
                      <div className="text-slate-500">עד {formatDate(booking.checkOut)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-500" />
                        <span className="text-sm">{booking.adults + booking.children}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-orange-600 dark:text-orange-400 hidden md:table-cell">
                      {formatCurrency(booking.balance)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="hidden sm:inline">{getStatusText(booking.status)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">אין הזמנות עדיין</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
