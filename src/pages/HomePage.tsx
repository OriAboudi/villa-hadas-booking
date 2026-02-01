import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Waves, Utensils, Users, Phone, Mail, Calendar, TrendingDown, Zap, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
    {
        icon: Waves,
        title: 'בריכה פרטית מחוממת',
        desc: 'בריכה יוקרתית לשימוש בלעדי – גם בחורף',
        gradient: 'from-blue-500 to-cyan-400',
    },
    {
        icon: Shield,
        title: 'חצר קדמית ואחורית',
        desc: 'מרחבים פתוחים עם נוף מדהים',
        gradient: 'from-purple-500 to-pink-500',
    },

    {
        icon: Utensils,
        title: 'מטבח מאובזר + גריל גז',
        desc: 'מושלם לארוחות משפחתיות ועל האש',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: Users,
        title: 'עד 12 אורחים',
        desc: '5 חדרי שינה מרווחים, כולל ג׳קוזי בחדרים העליונים',
        gradient: 'from-green-500 to-emerald-500',
    },
];


const HOT_DEALS = [
    {
        title: 'מבצע סופ"ש',
        originalPrice: '₪3,500',
        salePrice: '₪2,800',
        discount: '20%',
        description: 'שישי-שבת (2 לילות)',
        badge: 'הכי פופולרי',
        gradient: 'from-rose-500 to-pink-600',
        icon: Calendar,
        features: ['צ\'ק אין מוקדם', 'ארוחת בוקר', 'ניקיון חינם']
    },
    {
        title: 'חבילת אמצע שבוע',
        originalPrice: '₪2,000',
        salePrice: '₪1,500',
        discount: '25%',
        description: 'ראשון-רביעי (4 לילות)',
        badge: 'חיסכון מקסימלי',
        gradient: 'from-amber-500 to-orange-600',
        icon: TrendingDown,
        features: ['גמישות בשעות', 'מחיר מיוחד', 'שדרוג חדר']
    },
    {
        title: 'דיל בזק',
        originalPrice: '₪1,200',
        salePrice: '₪999',
        discount: '17%',
        description: 'לילה אחד (ימים נבחרים)',
        badge: 'מוגבל!',
        gradient: 'from-violet-500 to-purple-600',
        icon: Zap,
        features: ['צ\'ק אאוט מאוחר', 'ברוכים הבאים', 'WiFi מהיר']
    },
];

const REVIEWS = [
    { name: 'שרה כהן', rating: 5, text: 'וילה מדהימה! היה לנו סוף שבוע מושלם. הבריכה מחוממת והגינה יפהפייה.', date: '2024-01-15', avatar: '👩' },
    { name: 'דוד לוי', rating: 5, text: 'חוויה מעולה! הוילה נקייה, מאובזרת וממוקמת במיקום מעולה. בהחלט נחזור!', date: '2024-01-10', avatar: '👨' },
    { name: 'מיכל אברהם', rating: 5, text: 'המקום הכי טוב לחופשה משפחתית. הילדים נהנו מהבריכה והגינה.', date: '2024-01-05', avatar: '👩' },
];

const IMAGES = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/hero-4.jpg',
];

const WHY_CHOOSE_US = [
    { icon: CheckCircle, title: '15 דקות מהכינרת', desc: 'מיקום מושלם לחופשה ליד המים והטבע' },
    { icon: CheckCircle, title: 'בריכה פרטית מחוממת', desc: 'שחייה מפנקת בכל עונות השנה' },
    {
        icon: CheckCircle,
        title: 'מאובזר ברמה גבוהה',
        desc: 'כולל ציוד משחקים לילדים לנוחות והנאה לכל המשפחה'
    },
    {
        icon: CheckCircle,
        title: 'אזור שקט עם בתי כנסת בקרבת מקום',
        desc: 'מתאים למשפחות, קבוצות ונופשים מכל המגזרים',
    },
];


export const HomePage = () => {
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % IMAGES.length);
        }, 4000); // כל 4 שניות

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

            {/* Hero Section - Improved Responsiveness */}
            <section className="relative h-[85vh] sm:h-[75vh] md:h-[70vh] min-h-[600px] sm:min-h-[500px] overflow-hidden">
                {/* Background Images */}
                <div className="absolute inset-0">
                    {IMAGES.map((img, idx) => (
                        <motion.img
                            key={img}
                            src={img}
                            alt={`וילת הדס ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: selectedImage === idx ? 1 : 0 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}

                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-5xl"
                    >
                        {/* Badge */}
                        {/* <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 
                                          bg-gradient-to-r from-amber-500 to-orange-500 
                                          text-white rounded-full shadow-2xl text-xs sm:text-sm font-bold">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>דירוג 5 כוכבים ב-Google</span>
                            </div>
                        </motion.div> */}

                        {/* Title */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                                     font-display font-black text-white text-center
                                     leading-tight">
                            וילת הדס
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 
                                    font-light text-center px-4">
                            חוויית אירוח יוקרתי עם בריכה מחוממת בצפון הארץ
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Link
                                to="/contract"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                         px-8 sm:px-12 md:px-16 py-4 sm:py-5 
                                         bg-gradient-to-r from-blue-600 to-purple-600
                                         text-white font-bold text-base sm:text-lg md:text-xl 
                                         rounded-full shadow-2xl
                                         hover:scale-105 hover:shadow-blue-500/50
                                         transition-all duration-300"
                            >
                                <Calendar className="w-5 h-5" />
                                הזמן עכשיו
                            </Link>
                            <a
                                href="tel:0503313193"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                         px-8 sm:px-12 md:px-16 py-4 sm:py-5 
                                         bg-white/10 backdrop-blur-md text-white 
                                         font-bold text-base sm:text-lg md:text-xl 
                                         rounded-full border-2 border-white/30
                                         hover:bg-white/20 hover:scale-105
                                         transition-all duration-300"
                            >
                                <Phone className="w-5 h-5" />
                                התקשר עכשיו
                            </a>
                        </div>

                        {/* Features Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl mx-auto px-2">
                            {[
                                { icon: '🏊', text: 'בריכה מחוממת' },
                                { icon: '🎯', text: 'אזור משחקים' },
                                { icon: '🛏️', text: '4 חדרי שינה' },
                                { icon: '🍳', text: 'מטבח מאובזר' }
                            ].map((item) => (
                                <motion.div
                                    key={item.text}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 sm:px-4 py-2 bg-white/15 backdrop-blur-md 
                                             rounded-full border border-white/20
                                             hover:bg-white/25 transition-all duration-200
                                             flex items-center gap-2"
                                >
                                    <span className="text-lg sm:text-xl">{item.icon}</span>
                                    <span className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">
                                        {item.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Dots */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 
                                  flex gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                        {IMAGES.map((img, idx) => (
                            <button
                                key={img}
                                onClick={() => setSelectedImage(idx)}
                                className={`rounded-full transition-all ${selectedImage === idx
                                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white'
                                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Hot Deals Section - NEW */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 
                                      bg-gradient-to-r from-red-500 to-orange-500 
                                      text-white rounded-full mb-4 text-sm sm:text-base font-bold">
                            🔥 מבצעים חמים
                        </div>
                        <h2 className="text-1xl sm:text-4xl md:text-4xl  font-bold
                                     text-slate-900 dark:text-white mb-3 sm:mb-4">
                            חסכו עד 25% עכשיו!
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
                            מבצעים מוגבלים בזמן - אל תפספסו!
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {HOT_DEALS.map((deal, idx) => (
                            <motion.div
                                key={deal.title}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group"
                            >
                                {/* Badge */}
                                <div className="absolute -top-3 -right-3 z-10">
                                    <div className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${deal.gradient} 
                                                  text-white rounded-full shadow-xl text-xs sm:text-sm font-bold
                                                  animate-pulse`}>
                                        {deal.badge}
                                    </div>
                                </div>

                                {/* Card */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl 
                                              shadow-xl hover:shadow-2xl 
                                              border-2 border-slate-200 dark:border-slate-700
                                              overflow-hidden transition-all duration-300 
                                              hover:-translate-y-2 h-full">

                                    {/* Header with gradient */}
                                    <div className={`bg-gradient-to-r ${deal.gradient} p-4 sm:p-6 text-white`}>
                                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                                                    {deal.title}
                                                </h3>
                                                <p className="text-white/90 text-xs sm:text-sm">
                                                    {deal.description}
                                                </p>
                                            </div>
                                            <deal.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-end gap-2 sm:gap-3">
                                            <div>
                                                <div className="text-xs sm:text-sm text-white/80 line-through">
                                                    {deal.originalPrice}
                                                </div>
                                                <div className="text-3xl sm:text-4xl md:text-5xl font-black">
                                                    {deal.salePrice}
                                                </div>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg mb-1 sm:mb-2">
                                                <span className="text-lg sm:text-xl font-bold">-{deal.discount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                                        {deal.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 sm:gap-3">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <div className="p-4 sm:p-6 pt-0">
                                        <Link
                                            to="/contract"
                                            className={`w-full block text-center px-4 sm:px-6 py-3 sm:py-4 
                                                      bg-gradient-to-r ${deal.gradient} 
                                                      text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl
                                                      hover:scale-105 transition-all duration-300 shadow-lg`}
                                        >
                                            הזמן את המבצע
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Limited Time Banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 sm:mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 
                                      bg-gradient-to-r from-yellow-400 to-amber-500 
                                      text-slate-900 rounded-full shadow-2xl text-sm sm:text-base font-bold">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>⏰ המבצעים תקפים עד סוף החודש בלבד!</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us - NEW */}
            <section className="py-12 sm:py-16 md:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-8 sm:mb-12 
                                 text-slate-900 dark:text-white">
                        למה לבחור בנו?
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {WHY_CHOOSE_US.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center p-4 sm:p-6"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
                                              bg-gradient-to-br from-green-500 to-emerald-500 
                                              rounded-full flex items-center justify-center shadow-lg">
                                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 
                                             text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-display font-bold text-center 
                                 mb-8 sm:mb-12 text-slate-900 dark:text-white"
                    >
                        מה מחכה לכם?
                    </motion.h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg 
                                         hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} 
                                              rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-xl 
                                              hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12 sm:py-16 md:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-center 
                                 mb-8 sm:mb-12 text-slate-900 dark:text-white">
                        גלריית תמונות
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {IMAGES.map((img, idx) => (
                            <motion.div
                                key={img}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg 
                                         hover:shadow-2xl transition-all duration-300 cursor-pointer
                                         hover:scale-105"
                                onClick={() => setSelectedImage(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`וילת הדס ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-center 
                                 mb-8 sm:mb-12 text-slate-900 dark:text-white">
                        מה הלקוחות שלנו אומרים?
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {REVIEWS.map((review, idx) => (
                            <motion.div
                                key={review.name}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg
                                         hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-sm sm:text-base">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 
                                                  rounded-full flex items-center justify-center text-xl sm:text-2xl">
                                        {review.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                            {review.name}
                                        </div>
                                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(review.date).toLocaleDateString('he-IL')}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact/Location */}
            <section className="py-12 sm:py-16 md:py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 sm:mb-8 
                                 text-slate-900 dark:text-white">
                        צור קשר
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 
                                          rounded-full flex items-center justify-center shadow-2xl
                                          hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                            </div>
                            <a href="tel:0503313193"
                                className="text-base sm:text-lg font-semibold hover:text-primary-600 
                transition-colors text-slate-900 dark:text-white">
                                050-331-3193
                            </a>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 
                                          rounded-full flex items-center justify-center shadow-2xl
                                          hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                            </div>
                            <a href="mailto:vilathadass@gmail.com"
                                className="text-base sm:text-lg font-semibold hover:text-primary-600 
                                        transition-colors text-slate-900 dark:text-white break-all">
                                vilathadass@gmail.com
                            </a>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 
                                          rounded-full flex items-center justify-center shadow-2xl
                                          hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                                רחוב הדס 15, יבניאל
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                            מוכנים לחוויה בלתי נשכחת?
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8">
                            הזמינו עכשיו וקבלו הנחה מיוחדת!
                        </p>
                        <Link
                            to="/contract"
                            className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 
                                     bg-white text-blue-600 font-bold text-base sm:text-lg md:text-xl 
                                     rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                            הזמן את השהות שלך
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-6 sm:py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-slate-400 text-sm sm:text-base">
                        © 2025 וילת הדס. כל הזכויות שמורות.
                    </p>
                </div>
            </footer>
        </div>
    );
};