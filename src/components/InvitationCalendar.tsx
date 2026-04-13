import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Invitation } from '../types';

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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr: string): Invitation[] => {
    return invitations.filter(inv => inv.eventDate === dateStr);
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
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-4"
    >
      {/* Header with Month/Year and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
          >
            {day.substring(0, 1)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              const dateStr = day
                ? formatDateKey(year, month, day)
                : null;
              const dayEvents = dateStr ? getEventsForDate(dateStr) : [];
              const isToday =
                day &&
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <motion.div
                  key={dayIndex}
                  whileHover={day ? { scale: 1.05 } : {}}
                  className={`min-h-24 p-2 rounded-lg transition-all ${
                    !day
                      ? 'bg-transparent'
                      : isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : dayEvents.length > 0
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
                    <div className="space-y-1">
                      <div
                        className={`text-sm font-bold ${
                          isToday
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {day}
                      </div>

                      {/* Event Dots */}
                      {dayEvents.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.2 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onEventClick) {
                                  onEventClick(event);
                                }
                              }}
                              className="w-2 h-2 rounded-full transition-all hover:w-3 hover:h-3"
                              style={{ backgroundColor: event.color }}
                              title={event.guestName}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                              +{dayEvents.length - 3}
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
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          🔑 מקרא:
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>היום</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span>עם אירועים</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
