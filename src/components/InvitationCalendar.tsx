import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Invitation, BookingData } from '../types';
import { getAllBookings } from '../lib/firebase';

interface InvitationCalendarProps {
  invitations: Invitation[];
  onDateClick?: (date: string) => void;
  onEventClick?: (invitation: Invitation) => void;
}

export const InvitationCalendar = ({
  invitations,
  onDateClick,
  onEventClick,
}: InvitationCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Load bookings to show on calendar
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    };
    loadBookings();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr: string) => {
    const invitationEvents = invitations.filter(inv => inv.eventDate === dateStr);
    const bookingEvents = bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
      const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];
      const currentDate = dateStr;
      return currentDate >= checkInDate && currentDate < checkOutDate;
    });
    return { invitations: invitationEvents, bookings: bookingEvents };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
  ];

  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 space-y-3"
    >
      {/* Header with Month/Year and Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 py-1"
          >
            {day.substring(0, 1)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const dateStr = day
                ? formatDateKey(year, month, day)
                : null;
              const dayEvents = dateStr ? getEventsForDate(dateStr) : { invitations: [], bookings: [] };
              const isToday =
                day &&
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              const hasEvents = dayEvents.invitations.length > 0 || dayEvents.bookings.length > 0;

              return (
                <motion.div
                  key={dayIndex}
                  whileHover={day ? { scale: 1.05 } : {}}
                  className={`aspect-square p-1 rounded-lg transition-all text-center flex flex-col items-center justify-center ${
                    !day
                      ? 'bg-transparent'
                      : isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : hasEvents
                      ? 'bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600'
                      : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                  } ${day ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (day && onDateClick) {
                      onDateClick(dateStr!);
                    }
                  }}
                >
                  {day && (
                    <div className="w-full space-y-0.5">
                      <div
                        className={`text-xs font-bold ${
                          isToday
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {day}
                      </div>

                      {/* Event Dots - Invitations (blue) and Bookings (green) */}
                      {hasEvents && (
                        <div className="flex justify-center gap-0.5 flex-wrap">
                          {/* Invitation dots */}
                          {dayEvents.invitations.slice(0, 1).map((event, idx) => (
                            <motion.button
                              key={`inv-${idx}`}
                              whileHover={{ scale: 1.3 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEventClick) {
                                  onEventClick(event);
                                }
                              }}
                              className="w-1.5 h-1.5 rounded-full transition-all bg-blue-500"
                              title={`אירוע: ${event.guestName}`}
                            />
                          ))}
                          {/* Booking dots */}
                          {dayEvents.bookings.slice(0, 1).map((booking, idx) => (
                            <span
                              key={`book-${idx}`}
                              className="w-1.5 h-1.5 rounded-full bg-green-500"
                              title={`הזמנה: ${booking.fullName}`}
                            />
                          ))}
                          {dayEvents.invitations.length + dayEvents.bookings.length > 2 && (
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-none">
                              +
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          🔑 מקרא:
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span>היום</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>אירועים</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>הזמנות</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
