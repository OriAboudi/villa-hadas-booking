import { motion } from 'framer-motion';
import { Calendar, Tag, CalendarDays, Image as ImageIcon, Settings } from 'lucide-react';

interface AdminTabsProps {
  activeTab: 'bookings' | 'deals' | 'invitations' | 'images' | 'settings';
  onTabChange: (tab: 'bookings' | 'deals' | 'invitations' | 'images' | 'settings') => void;
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  const tabs = [
    { id: 'bookings' as const, label: 'הזמנות', icon: Calendar },
    { id: 'deals' as const, label: 'מבצעים', icon: Tag },
    { id: 'invitations' as const, label: 'אירועים', icon: CalendarDays },
    { id: 'images' as const, label: 'תמונות', icon: ImageIcon },
    { id: 'settings' as const, label: 'הגדרות', icon: Settings },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl transition-all whitespace-nowrap font-medium ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </motion.div>
  );
};
