import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { Deal } from '../../types';
import { getAllDeals, saveDeal, updateDeal, deleteDeal } from '../../lib/firebase';
import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from '../ui/Modal';

export const DealsTab = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: 0,
    salePrice: 0,
    discount: '0%',
    badge: '',
    gradient: 'from-rose-500 to-pink-600',
    iconName: 'Calendar',
    features: [''] as string[],
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getAllDeals();
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDeal = async () => {
    if (!formData.title || !formData.description) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    try {
      if (editingDeal?.id) {
        await updateDeal(editingDeal.id, {
          ...formData,
          createdAt: editingDeal.createdAt,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await saveDeal({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await loadDeals();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('שגיאה בשמירת המבצע');
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מבצע זה?')) return;
    try {
      await deleteDeal(id);
      await loadDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('שגיאה במחיקת המבצע');
    }
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description,
      originalPrice: deal.originalPrice,
      salePrice: deal.salePrice,
      discount: deal.discount,
      badge: deal.badge,
      gradient: deal.gradient,
      iconName: deal.iconName,
      features: deal.features,
      isActive: deal.isActive,
      displayOrder: deal.displayOrder,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      description: '',
      originalPrice: 0,
      salePrice: 0,
      discount: '0%',
      badge: '',
      gradient: 'from-rose-500 to-pink-600',
      iconName: 'Calendar',
      features: [''],
      isActive: true,
      displayOrder: 0,
    });
  };

  if (loading) return <LoadingSpinner message="טוען מבצעים..." />;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          ניהול מבצעים ({deals.length})
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
          <span>מבצע חדש</span>
        </button>
      </div>

      {/* Deals Grid */}
      {deals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border-2 ${
                deal.isActive
                  ? 'border-green-200 dark:border-green-800'
                  : 'border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {deal.description}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    deal.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {deal.isActive ? 'פעיל' : 'לא פעיל'}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">מחיר מקורי:</span>
                  <span className="font-bold">₪{deal.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">מחיר עכשיו:</span>
                  <span className="font-bold text-green-600">₪{deal.salePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">הנחה:</span>
                  <span className="font-bold">{deal.discount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditDeal(deal)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                           bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400
                           rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm">ערוך</span>
                </button>
                <button
                  onClick={() => deal.id && handleDeleteDeal(deal.id)}
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
          <p className="text-slate-600 dark:text-slate-400">אין מבצעים עדיין</p>
        </div>
      )}

      {/* Deal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingDeal ? 'ערוך מבצע' : 'מבצע חדש'}
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              שם המבצע
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              placeholder="למשל: מבצע סופ״ש"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              תיאור
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              placeholder="למשל: שישי-שבת (2 לילות)"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                מחיר מקורי
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                מחיר הנחה
              </label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                         rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              אחוז הנחה
            </label>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              placeholder="למשל: 20%"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              תג (Badge)
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600
                       rounded-lg dark:bg-slate-700 dark:text-white"
              placeholder="למשל: הכי פופולרי"
            />
          </div>

          {/* Gradient Color Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              צבע הרקע של הכרטיס
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'ורוד', gradient: 'from-rose-500 to-pink-600' },
                { name: 'כתום', gradient: 'from-amber-500 to-orange-600' },
                { name: 'סגול', gradient: 'from-violet-500 to-purple-600' },
                { name: 'כחול', gradient: 'from-blue-500 to-cyan-500' },
                { name: 'ירוק', gradient: 'from-emerald-500 to-teal-600' },
                { name: 'אדום', gradient: 'from-red-500 to-rose-600' },
              ].map((option) => (
                <button
                  key={option.gradient}
                  onClick={() => setFormData({ ...formData, gradient: option.gradient })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.gradient === option.gradient
                      ? 'border-slate-900 dark:border-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  title={option.name}
                >
                  <div
                    className={`h-8 rounded bg-gradient-to-r ${option.gradient}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              הצג על העמוד הבית
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSaveDeal}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600
                     text-white font-bold rounded-lg hover:scale-105 transition-transform"
          >
            {editingDeal ? 'עדכן מבצע' : 'הוסף מבצע'}
          </button>
        </div>
      </Modal>
    </div>
  );
};
