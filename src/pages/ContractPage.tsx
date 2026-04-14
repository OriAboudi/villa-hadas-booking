import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Send, Loader2, User, Calendar, CreditCard, FileText, Gift } from 'lucide-react';
import { calculateNights, formatCurrency } from '../lib/utils';
import type { BookingData, Deal } from '../types';
import { sendBookingEmails } from '../lib/emailService';
import { saveBooking, getPageSettings, getActiveDeals } from '../lib/firebase';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  icon?: React.ComponentType<{ size: number }>;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  required = false,
  icon: Icon,
  value,
  onChange,
  error,
  placeholder,
  maxLength,
  min,
  max
}) => {
  const hasValue = value && String(value).length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-luxury-navy dark:text-luxury-ivory">
        {label} {required && <span className="text-luxury-gold">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-slate dark:text-luxury-mist">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          className={`w-full ${Icon ? 'pr-12' : 'pr-4'} pl-4 py-3 rounded-lg border-2
                     font-medium transition-all duration-200
                     focus:outline-none focus:ring-4 focus:ring-luxury-gold/20
                     dark:bg-luxury-navy dark:text-white
                     ${error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : hasValue
                ? 'border-luxury-gold bg-luxury-ivory/50 dark:bg-luxury-navy/50'
                : 'border-luxury-mist dark:border-luxury-navy-dark bg-white dark:bg-luxury-navy/30'
            }`}
        />
        {hasValue && !error && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Check size={20} className="text-luxury-gold" />
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
        >
          <AlertCircle size={16} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ⭐ עכשיו הקומפוננט הראשי
export const ContractPage = () => {
  const location = useLocation();
  const dealFromState = location.state?.deal as Deal | undefined;

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pricePerNight, setPricePerNight] = useState<number>(1500);
  const [availableDeals, setAvailableDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(dealFromState?.id || null);

  const [formData, setFormData] = useState<Partial<BookingData>>({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    deposit: 0,
    status: 'pending',
  });

  // Load available deals and set price
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load available deals
        const deals = await getActiveDeals();
        setAvailableDeals(deals);

        // If coming from a deal, use deal price FIRST
        if (dealFromState && dealFromState.salePrice > 0) {
          console.log('✅ Using deal price:', dealFromState.salePrice);
          setPricePerNight(dealFromState.salePrice);
        } else {
          // Otherwise load from settings
          const settings = await getPageSettings();
          console.log('✅ Using settings price:', settings.pricePerNight);
          setPricePerNight(settings.pricePerNight);
        }
      } catch (error) {
        console.error('Error loading price settings:', error);
        setPricePerNight(1500); // Fallback
      }
    };
    loadData();
  }, [dealFromState]);

  // Handle deal selection
  const handleDealChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dealId = e.target.value;
    setSelectedDealId(dealId || null);

    if (dealId) {
      const selectedDeal = availableDeals.find(d => d.id === dealId);
      if (selectedDeal) {
        setPricePerNight(selectedDeal.salePrice);
        console.log('✅ Selected deal price:', selectedDeal.salePrice);
      }
    } else {
      // Reset to settings price
      getPageSettings().then(settings => {
        setPricePerNight(settings.pricePerNight);
      });
    }
  };

  // חישוב מחירים
  const nights = calculateNights(formData.checkIn || '', formData.checkOut || '');
  const totalPrice = nights * pricePerNight;
  const balance = totalPrice - (formData.deposit || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'נא להזין שם מלא';
    }
    if (!formData.idNumber || !/^\d{9}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'נא להזין תעודת זהות תקינה (9 ספרות)';
    }
    if (!formData.phone || !/^05\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'נא להזין מספר נייד תקין';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'נא להזין כתובת אימייל תקינה';
    }
    if (!formData.checkIn) {
      newErrors.checkIn = 'נא לבחור תאריך כניסה';
    }
    if (!formData.checkOut) {
      newErrors.checkOut = 'נא לבחור תאריך יציאה';
    }
    if (formData.checkIn && formData.checkOut && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = 'תאריך יציאה חייב להיות אחרי תאריך כניסה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ הכן את הנתונים
      const bookingData: Omit<BookingData, 'id'> = {
        fullName: formData.fullName || '',
        idNumber: formData.idNumber || '',
        phone: formData.phone || '',
        email: formData.email || '',
        checkIn: formData.checkIn || '',
        checkOut: formData.checkOut || '',
        adults: formData.adults || 1,
        children: formData.children || 0,
        totalPrice: totalPrice,
        deposit: formData.deposit || 0,
        balance: balance,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // 2️⃣ שמור ב-Firebase
      const savedBooking = await saveBooking(bookingData);
      console.log('✅ Saved to Firebase:', savedBooking);

      // 3️⃣ שלח מיילים
      const emailData = {
        ...bookingData,
        nights: nights,
        totalPrice: formatCurrency(totalPrice),
        deposit: formatCurrency(formData.deposit || 0),
        balance: formatCurrency(balance),
      };

      await sendBookingEmails(emailData);
      console.log('✅ Emails sent');

      // 4️⃣ הצג הצלחה
      setSuccess(true);

      // 5️⃣ נקה טופס
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          fullName: '',
          idNumber: '',
          phone: '',
          email: '',
          checkIn: '',
          checkOut: '',
          adults: 1,
          children: 0,
          deposit: 0,
          status: 'pending',
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting booking:', error);
      alert('אירעה שגיאה בשליחת ההזמנה. נא לנסות שוב.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-luxury-ivory dark:bg-luxury-navy py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="mb-4">
            <div className="h-1 w-20 bg-luxury-gold mx-auto mb-6"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-luxury-navy dark:text-luxury-ivory">
            שמור מקום בוילה הדס
          </h1>
          <p className="text-lg text-luxury-slate dark:text-luxury-mist max-w-2xl mx-auto">
            שמרו את המקום שלכם עוד היום. מייד נחזור אליכם עם הצעת מחיר מותאמת אישית וכל הפרטים שתצטרכו.
          </p>
        </motion.div>

        {/* Deal Info - if from deal */}
        {dealFromState && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-8 rounded-xl border-2 border-luxury-gold bg-white dark:bg-luxury-navy
                       shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-luxury-navy dark:text-luxury-ivory mb-2">
                  {dealFromState.title}
                </h3>
                <p className="text-luxury-slate dark:text-luxury-mist mb-3">
                  {dealFromState.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dealFromState.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-luxury-ivory dark:bg-luxury-navy-dark rounded-sm text-sm text-luxury-navy dark:text-luxury-ivory">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-luxury-slate dark:text-luxury-mist line-through">
                  ₪{dealFromState.originalPrice}
                </div>
                <div className="text-3xl font-black text-luxury-navy dark:text-luxury-ivory">
                  ₪{dealFromState.salePrice}
                </div>
                <div className="text-sm font-bold text-luxury-gold">
                  -{dealFromState.discount}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-luxury-navy/30 rounded-2xl shadow-lg p-8 md:p-12 space-y-10 border border-luxury-mist dark:border-luxury-navy-dark"
        >

          {/* Personal Details */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
              <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                            flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white dark:text-luxury-navy" />
              </div>
              <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">פרטים אישיים</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="שם מלא"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
                icon={User}
                placeholder="שם פרטי ומשפחה"
              />
              <InputField
                label="תעודת זהות"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                error={errors.idNumber}
                required
                maxLength={9}
                placeholder="123456789"
              />
              <InputField
                label="טלפון נייד"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                maxLength={10}
                placeholder="0501234567"
              />
              <InputField
                label="דוא״ל"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="example@email.com"
              />
            </div>
          </section>

          {/* Dates */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
              <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                            flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white dark:text-luxury-navy" />
              </div>
              <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">תאריכי שהייה</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="כניסה"
                name="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={handleChange}
                error={errors.checkIn}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              <InputField
                label="יציאה"
                name="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={handleChange}
                error={errors.checkOut}
                required
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
              />
              <div className="space-y-2">
                <label className="block text-sm font-bold text-luxury-navy dark:text-luxury-ivory">
                  מספר לילות
                </label>
                <div className="w-full px-4 py-3 rounded-lg border-2 border-luxury-gold
                              bg-luxury-ivory dark:bg-luxury-navy/50 font-bold text-lg text-center
                              text-luxury-navy dark:text-luxury-ivory">
                  {nights || 0}
                </div>
              </div>
            </div>
          </section>

          {/* Guests */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
              <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                            flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white dark:text-luxury-navy" />
              </div>
              <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">מספר אורחים</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="מבוגרים"
                name="adults"
                type="number"
                value={formData.adults}
                onChange={handleChange}
                error={errors.adults}
                min={1}
                max={12}
                required
              />
              <InputField
                label="ילדים"
                name="children"
                type="number"
                value={formData.children}
                onChange={handleChange}
                error={errors.children}
                min={0}
                max={10}
              />
            </div>
          </section>

          {/* Deal Selector */}
          {availableDeals.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
                <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                              flex items-center justify-center shadow-md">
                  <Gift className="w-6 h-6 text-white dark:text-luxury-navy" />
                </div>
                <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">בחר מבצע (אופציונלי)</h2>
              </div>
              <div className="bg-luxury-cream dark:bg-luxury-navy/20
                            rounded-xl p-6 border-2 border-luxury-mist dark:border-luxury-navy-dark">
                <select
                  value={selectedDealId || ''}
                  onChange={handleDealChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-luxury-gold dark:border-luxury-gold
                           bg-white dark:bg-luxury-navy text-luxury-navy dark:text-luxury-ivory
                           focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold transition-all"
                >
                  <option value="">-- ללא מבצע (מחיר רגיל) --</option>
                  {availableDeals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.title} - ₪{deal.salePrice} (חיסכון {deal.discount})
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-sm text-luxury-slate dark:text-luxury-mist">
                  💡 בחר מבצע כדי לקבל מחיר מיוחד. המחיר יתעדכן אוטומטית.
                </p>
              </div>
            </section>
          )}

          {/* Payment Summary */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
              <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                            flex items-center justify-center shadow-md">
                <CreditCard className="w-6 h-6 text-white dark:text-luxury-navy" />
              </div>
              <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">הערכת מחיר</h2>
            </div>
            <div className="bg-luxury-cream dark:bg-luxury-navy/20
                          rounded-xl p-6 space-y-4 border border-luxury-mist dark:border-luxury-navy-dark">
              <div className="flex justify-between items-center text-lg">
                <span className="text-luxury-slate dark:text-luxury-mist">מחיר ללילה:</span>
                <span className="font-bold text-luxury-navy dark:text-luxury-ivory">₪{pricePerNight.toLocaleString('he-IL')}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-luxury-slate dark:text-luxury-mist">מספר לילות:</span>
                <span className="font-bold text-luxury-navy dark:text-luxury-ivory">{nights}</span>
              </div>
              <div className="h-px bg-luxury-mist dark:bg-luxury-navy-dark"></div>
              <div className="flex justify-between items-center text-2xl">
                <span className="font-bold text-luxury-navy dark:text-luxury-ivory">הערכת סכום:</span>
                <span className="font-bold text-luxury-gold">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              {/* <InputField 
                label="מקדמה ששולמה" 
                name="deposit"
                type="number"
                value={formData.deposit}
                onChange={handleChange}
                error={errors.deposit}
                min={0}
                placeholder="0"
              />
               */}
              {/* <div className="flex justify-between items-center text-xl pt-4 border-t-2 border-slate-300 dark:border-slate-600">
                <span className="font-bold text-slate-900 dark:text-white">לתשלום:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(balance)}
                </span>
              </div> */}
            </div>
          </section>

          {/* Terms */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-luxury-mist dark:border-luxury-navy-dark">
              <div className="w-12 h-12 rounded-lg bg-luxury-navy dark:bg-luxury-gold
                            flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white dark:text-luxury-navy" />
              </div>
              <h2 className="text-2xl font-bold text-luxury-navy dark:text-luxury-ivory">תנאים והגבלות</h2>
            </div>
            <div className="bg-luxury-cream dark:bg-luxury-navy/20 rounded-xl p-6 max-h-60 overflow-y-auto
                          border-2 border-luxury-mist dark:border-luxury-navy-dark">
              <ul className="space-y-3 text-luxury-charcoal dark:text-luxury-mist">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>ביטול עד 30 יום לפני - החזר מלא למעט דמי ביטול של 300 ₪</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>ביטול 14-30 יום לפני - דמי ביטול 25%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>ביטול פחות מ-14 יום לפני - דמי ביטול 50%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>שעת כניסה: 15:00 | שעת יציאה: 11:00</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>אסור לעשן בתוך הוילה</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                  <span>שעות שקט: 23:00-07:00</span>
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-5 h-5 rounded border-2 border-luxury-mist dark:border-luxury-navy-dark
                         text-luxury-navy focus:ring-4 focus:ring-luxury-gold/20
                         cursor-pointer accent-luxury-navy dark:accent-luxury-gold"
              />
              <span className="text-sm text-luxury-charcoal dark:text-luxury-mist group-hover:text-luxury-navy dark:group-hover:text-luxury-gold transition-colors">
                אני מאשר/ת שקראתי והבנתי את התנאים וההגבלות
              </span>
            </label>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-lg font-bold text-lg
                     bg-luxury-navy dark:bg-luxury-gold text-white dark:text-luxury-navy
                     shadow-md hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 hover:bg-luxury-navy-dark dark:hover:bg-luxury-gold-dark
                     flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>שולח...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-6 h-6" />
                <span>התקבל בהצלחה! נחזור אליך בקרוב</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>שמור את המקום שלי</span>
              </>
            )}
          </button>
        </motion.form>
      </div>

      {/* Success Modal */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white dark:bg-luxury-navy rounded-2xl p-12 max-w-md text-center shadow-lg border border-luxury-gold"
          >
            <div className="w-20 h-20 bg-luxury-navy dark:bg-luxury-gold
                          rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Check className="w-10 h-10 text-white dark:text-luxury-navy" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-luxury-navy dark:text-luxury-ivory font-display">
              המקום שלך שמור!
            </h2>
            <p className="text-luxury-slate dark:text-luxury-mist text-lg mb-4">
              קיבלתם אישור במייל. נציג שלנו יחזור אליכם בקרוב עם הצעת מחיר מותאמת אישית.
            </p>
            <p className="text-sm text-luxury-gold font-medium">
              תודה שבחרתם בוילת הדס! 🏡
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};