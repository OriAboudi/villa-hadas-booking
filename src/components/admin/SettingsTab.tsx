import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save } from 'lucide-react';
import type { PageSettings } from '../../types';
import { getPageSettings, savePageSettings } from '../../lib/firebase';
import { LoadingSpinner } from '../LoadingSpinner';

export const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PageSettings>({
    heroTitle: 'Villa Hadas',
    heroSubtitle: 'עלייה נדירה למנוחה מושלמת',
    heroButtonText: 'הזמן עכשיו',
    contactEmail: 'contact@villahadas.com',
    contactPhone: '+972-2-123-4567',
    aboutTitle: 'אודות וילה הדס',
    aboutDescription: 'ביוטה אירוח יוקרתית בלב הטבע',
    featuresTitle: 'המשכנעות שלנו',
    siteTitle: 'Villa Hadas',
    siteLogo: '',
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getPageSettings();
      setFormData(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await savePageSettings({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      alert('✅ ההגדרות נשמרו בהצלחה');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="טוען הגדרות..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Settings className="w-6 h-6" />
        הגדרות עמוד
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg space-y-6"
      >
        {/* Site Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            שם האתר
          </label>
          <input
            type="text"
            value={formData.siteTitle}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                     rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="שם האתר"
          />
        </div>

        {/* Hero Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            🎨 סעיף Hero (עמוד הבית)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                כותרת עיקרית
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="כותרת ראשית"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                תיאור קצר
              </label>
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="תיאור תחת הכותרת"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                טקסט כפתור ה-CTA
              </label>
              <input
                type="text"
                value={formData.heroButtonText}
                onChange={(e) => setFormData({ ...formData, heroButtonText: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="למשל: הזמן עכשיו"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            📖 סעיף About
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                כותרת
              </label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="כותרת סעיף About"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                תיאור
              </label>
              <textarea
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="תיאור פרטי על ביוטת הנופש"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            ⭐ סעיף Features
          </h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              כותרת
            </label>
            <input
              type="text"
              value={formData.featuresTitle}
              onChange={(e) => setFormData({ ...formData, featuresTitle: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="כותרת סעיף המאפיינים"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            📞 פרטי קשר
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                אימייל
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                טלפון
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="+972-2-123-4567"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600
                     text-white font-bold rounded-lg hover:scale-105 transition-transform
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </button>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center">
            עדכון אחרון: {new Date(formData.updatedAt).toLocaleDateString('he-IL')} בשעה {new Date(formData.updatedAt).toLocaleTimeString('he-IL')}
          </p>
        </div>
      </motion.div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          💡 <strong>טיפ:</strong> כל השינויים שאתה מבצע כאן יעדכנו אוטומטית בעמוד הבית וברחבי האתר.
        </p>
      </div>
    </div>
  );
};
