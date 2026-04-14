import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Check } from 'lucide-react';
import type { BookingData } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { getAllBookings, updateBooking } from '../../lib/firebase';

export const BookingsTab = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(bookingId);
      await updateBooking(bookingId, { status: newStatus });
      // Update local state
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      alert(`✅ הזמנה ${newStatus === 'confirmed' ? 'אושרה' : newStatus === 'cancelled' ? 'בוטלה' : 'סומנה כממתינה'}`);
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('❌ שגיאה בעדכון ההזמנה');
    } finally {
      setUpdatingId(null);
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

      {/* Bookings Table - MAIN */}
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
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">פעולות</th>
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
                    <td className="px-6 py-4 flex gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking.id!, 'confirmed')}
                          disabled={updatingId === booking.id}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30
                                   text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-200
                                   dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                          title="אשר הזמנה"
                        >
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">אישור</span>
                        </button>
                      )}
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id!, e.target.value as 'pending' | 'confirmed' | 'cancelled')}
                        disabled={updatingId === booking.id}
                        className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white
                                 dark:bg-slate-700 text-sm text-slate-900 dark:text-white hover:border-blue-500
                                 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <option value="pending">ממתין</option>
                        <option value="confirmed">מאושר</option>
                        <option value="cancelled">בוטל</option>
                      </select>
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

      {/* Statistics - AT BOTTOM, SMALLER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">סה״כ</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.totalBookings}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">מאושרות</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.confirmedBookings}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">ממתינות</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.pendingBookings}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">הזמנות</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3 sm:p-4 shadow text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs opacity-90">הכנסות</span>
          </div>
          <div className="text-2xl font-bold mb-1">{formatCurrency(stats.totalRevenue)}</div>
          <div className="text-xs opacity-90">סה״כ</div>
        </motion.div>
      </div>
    </div>
  );
};
