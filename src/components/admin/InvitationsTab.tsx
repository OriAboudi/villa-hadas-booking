import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import type { Invitation } from '../../types';
import { getAllInvitations, saveInvitation, updateInvitation, deleteInvitation } from '../../lib/firebase';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../ui/Modal';
import { InvitationCalendar } from '../InvitationCalendar';

export const InvitationsTab = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formData, setFormData] = useState({
    guestName: '',
    eventType: 'wedding',
    eventDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '18:00',
    numberOfGuests: 1,
    phoneNumber: '',
    email: '',
    specialRequests: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled',
    color: '#3B82F6',
  });

  const eventTypes = [
    { id: 'wedding', label: 'חתונה' },
    { id: 'birthday', label: 'יום הולדת' },
    { id: 'corporate', label: 'אירוע קורפוראטיבי' },
    { id: 'family', label: 'אירוע משפחתי' },
    { id: 'other', label: 'אחר' },
  ];

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const statuses = ['pending', 'confirmed', 'cancelled'] as const;

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await getAllInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvitation = async () => {
    if (!formData.guestName || !formData.eventDate) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    try {
      if (editingInvitation?.id) {
        await updateInvitation(editingInvitation.id, {
          ...formData,
          createdAt: editingInvitation.createdAt,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await saveInvitation({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await loadInvitations();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving invitation:', error);
      alert('שגיאה בשמירת האירוע');
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק אירוע זה?')) return;
    try {
      await deleteInvitation(id);
      await loadInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      alert('שגיאה במחיקת האירוע');
    }
  };

  const handleEditInvitation = (invitation: Invitation) => {
    setEditingInvitation(invitation);
    setFormData({
      guestName: invitation.guestName,
      eventType: invitation.eventType,
      eventDate: invitation.eventDate,
      startTime: invitation.startTime,
      endTime: invitation.endTime,
      numberOfGuests: invitation.numberOfGuests,
      phoneNumber: invitation.phoneNumber,
      email: invitation.email,
      specialRequests: invitation.specialRequests,
      status: invitation.status,
      color: invitation.color,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingInvitation(null);
    setFormData({
      guestName: '',
      eventType: 'wedding',
      eventDate: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '18:00',
      numberOfGuests: 1,
      phoneNumber: '',
      email: '',
      specialRequests: '',
      status: 'pending',
      color: '#3B82F6',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'בהמתנה',
      confirmed: 'אושר',
      cancelled: 'בוטל',
    };
    return labels[status] || status;
  };

  if (loading) return <LoadingSpinner message="טוען אירועים..." />;

  // Sort invitations by date
  const sortedInvitations = [...invitations].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  // Get events for selected date
  const eventsForSelectedDate = selectedDate
    ? sortedInvitations.filter(inv => inv.eventDate === selectedDate)
    : sortedInvitations;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          ניהול אירועים ({invitations.length})
        </h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
                   text-white rounded-xl hover:scale-105 transition-transform font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>אירוע חדש</span>
        </button>
      </div>

      {/* Calendar + Events Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Left Side */}
        <div className="lg:col-span-1">
          <InvitationCalendar
            invitations={invitations}
            onDateClick={setSelectedDate}
            onEventClick={handleEditInvitation}
          />
        </div>

        {/* Events List - Right Side */}
        <div className="lg:col-span-2">
          {selectedDate && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>תאריך שנבחר:</strong> {new Date(selectedDate).toLocaleDateString('he-IL')}
              </p>
              <button
                onClick={() => setSelectedDate('')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
              >
                ← הצג הכל
              </button>
            </div>
          )}

          {eventsForSelectedDate.length > 0 ? (
        <div className="space-y-4">
          {sortedInvitations.map((invitation, index) => (
            <motion.div
              key={invitation.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-l-4"
              style={{
                borderLeftColor: invitation.color,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {invitation.guestName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(invitation.status)}`}>
                      {getStatusLabel(invitation.status)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {eventTypes.find(t => t.id === invitation.eventType)?.label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">תאריך</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(invitation.eventDate).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">שעה</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {invitation.startTime} - {invitation.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">מספר אורחים</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{invitation.numberOfGuests}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">טלפון</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{invitation.phoneNumber}</p>
                </div>
              </div>

              {invitation.specialRequests && (
                <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <strong>בקשות מיוחדות:</strong> {invitation.specialRequests}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditInvitation(invitation)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                           bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                           rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm">ערוך</span>
                </button>
                <button
                  onClick={() => invitation.id && handleDeleteInvitation(invitation.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                           bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                           rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">מחק</span>
                </button>
              </div>
            </motion.div>
          ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
              <p className="text-slate-600 dark:text-slate-400">
                {selectedDate ? 'אין אירועים בתאריך זה' : 'אין אירועים עדיין'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invitation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingInvitation ? 'ערוך אירוע' : 'אירוע חדש'}
      >
        <div className="space-y-4">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              שם האורח
            </label>
            <input
              type="text"
              value={formData.guestName}
              onChange={(e) =>
                setFormData({ ...formData, guestName: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              placeholder="למשל: דוד וראשה"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              סוג אירוע
            </label>
            <select
              value={formData.eventType}
              onChange={(e) =>
                setFormData({ ...formData, eventType: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
            >
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              תאריך
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                שעת התחלה
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                שעת סיום
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              מספר אורחים
            </label>
            <input
              type="number"
              value={formData.numberOfGuests}
              onChange={(e) =>
                setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              min="1"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                טלפון
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="05X-XXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                אימייל
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              בקשות מיוחדות
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white resize-none"
              placeholder="למשל: צרכים דיאטטיים, דרישות מיוחדות..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              סטטוס
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{getStatusLabel(status)}</option>
              ))}
            </select>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              צבע באירועים
            </label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSaveInvitation}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600
                     text-white font-bold rounded-lg hover:scale-105 transition-transform"
          >
            {editingInvitation ? 'עדכן אירוע' : 'הוסף אירוע'}
          </button>
        </div>
      </Modal>
    </div>
  );
};
