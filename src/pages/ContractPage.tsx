import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Send, Loader2, User, Calendar, CreditCard, FileText } from 'lucide-react';
import { calculateNights, formatCurrency } from '../lib/utils';
import type { BookingData } from '../types';
import { sendBookingEmails } from '../lib/emailService';
import { saveBooking } from '../lib/firebase';

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
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
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
          className={`w-full ${Icon ? 'pr-12' : 'pr-4'} pl-4 py-3 rounded-xl border-2 
                     font-medium transition-all duration-200
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20
                     dark:bg-slate-800 dark:text-white
                     ${error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : hasValue
                ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                : 'border-slate-300 dark:border-slate-600 bg-white'
            }`}
        />
        {hasValue && !error && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Check size={20} className="text-green-500" />
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // חישוב מחירים
  const nights = calculateNights(formData.checkIn || '', formData.checkOut || '');
  const pricePerNight = 1500;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900 dark:text-white">
            טופס הזמנה
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            מלאו את הפרטים ונשלח אליכם אישור בדוא"ל
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 space-y-10"
        >

          {/* Personal Details */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 
                            flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">פרטים אישיים</h2>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 
                            flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">תאריכי שהייה</h2>
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
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  מספר לילות
                </label>
                <div className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600
                              bg-slate-50 dark:bg-slate-900 font-bold text-lg text-center
                              text-blue-600 dark:text-blue-400">
                  {nights || 0}
                </div>
              </div>
            </div>
          </section>

          {/* Guests */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 
                            flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">מספר אורחים</h2>
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

          {/* Payment Summary */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 
                            flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">סיכום תשלום</h2>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 
                          rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-600 dark:text-slate-400">מחיר ללילה:</span>
                <span className="font-bold text-slate-900 dark:text-white">₪1,500</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-600 dark:text-slate-400">מספר לילות:</span>
                <span className="font-bold text-slate-900 dark:text-white">{nights}</span>
              </div>
              <div className="h-px bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex justify-between items-center text-2xl">
                <span className="font-bold text-slate-900 dark:text-white">סה״כ:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 
                            flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">תנאים והגבלות</h2>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 max-h-60 overflow-y-auto 
                          border-2 border-slate-200 dark:border-slate-700">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>ביטול עד 30 יום לפני - החזר מלא למעט דמי ביטול של 300 ₪</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>ביטול 14-30 יום לפני - דמי ביטול 25%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>ביטול פחות מ-14 יום לפני - דמי ביטול 50%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>שעת כניסה: 15:00 | שעת יציאה: 11:00</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>אסור לעשן בתוך הוילה</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>שעות שקט: 23:00-07:00</span>
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-3 mt-4 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600
                         text-blue-600 focus:ring-4 focus:ring-blue-500/20
                         cursor-pointer"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                אני מאשר/ת שקראתי והבנתי את התנאים וההגבלות
              </span>
            </label>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl font-bold text-lg
                     bg-gradient-to-r from-blue-600 to-purple-600 text-white
                     shadow-xl hover:shadow-2xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 hover:scale-[1.02]
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
                <span>נשלח בהצלחה!</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>שלח הזמנה</span>
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
            className="bg-white dark:bg-slate-800 rounded-3xl p-12 max-w-md text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 
                          rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              ההזמנה נשלחה בהצלחה!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              קיבלתם אישור במייל. נחזור אליכם בהקדם!
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};