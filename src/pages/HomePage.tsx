import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Waves, Utensils, Users, Phone, Mail, Calendar, TrendingDown, Zap, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Deal, ImageAsset } from '../types';
import { getActiveDeals, getImagesByCategory } from '../lib/firebase';
import { DealCard } from '../components/DealCard';
import { SkeletonCard } from '../components/SkeletonCard';

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

const REVIEWS = [
    { name: 'שרה כהן', rating: 5, text: 'וילה מדהימה! היה לנו סוף שבוע מושלם. הבריכה מחוממת והגינה יפהפייה.', date: '2024-01-15', avatar: '👩' },
    { name: 'דוד לוי', rating: 5, text: 'חוויה מעולה! הוילה נקייה, מאובזרת וממוקמת במיקום מעולה. בהחלט נחזור!', date: '2024-01-10', avatar: '👨' },
    { name: 'מיכל אברהם', rating: 5, text: 'המקום הכי טוב לחופשה משפחתית. הילדים נהנו מהבריכה והגינה.', date: '2024-01-05', avatar: '👩' },
];

const FALLBACK_IMAGES = [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/hero-4.jpg',
];

// Icon mapping for deal icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Calendar,
    TrendingDown,
    Zap,
    Star,
    Shield,
    Users,
};

// Fallback deals for initial setup
const FALLBACK_DEALS: Deal[] = [
    {
        title: 'מבצע סופ"ש',
        originalPrice: 3500,
        salePrice: 2800,
        discount: '20%',
        description: 'שישי-שבת (2 לילות)',
        badge: 'הכי פופולרי',
        gradient: 'from-rose-500 to-pink-600',
        iconName: 'Calendar',
        features: ['צ\'ק אין מוקדם', 'ארוחת בוקר', 'ניקיון חינם'],
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        title: 'חבילת אמצע שבוע',
        originalPrice: 2000,
        salePrice: 1500,
        discount: '25%',
        description: 'ראשון-רביעי (4 לילות)',
        badge: 'חיסכון מקסימלי',
        gradient: 'from-amber-500 to-orange-600',
        iconName: 'TrendingDown',
        features: ['גמישות בשעות', 'מחיר מיוחד', 'שדרוג חדר'],
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        title: 'דיל בזק',
        originalPrice: 1200,
        salePrice: 999,
        discount: '17%',
        description: 'לילה אחד (ימים נבחרים)',
        badge: 'מוגבל!',
        gradient: 'from-violet-500 to-purple-600',
        iconName: 'Zap',
        features: ['צ\'ק אאוט מאוחר', 'ברוכים הבאים', 'WiFi מהיר'],
        isActive: true,
        displayOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
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
    const [deals, setDeals] = useState<Deal[]>(FALLBACK_DEALS);
    const [heroImages, setHeroImages] = useState<ImageAsset[]>([]);
    const [galleryImages, setGalleryImages] = useState<ImageAsset[]>([]);
    const [loading, setLoading] = useState(true);

    // Load deals and images from Firebase
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [dealsData, heroImgsData, galleryImgsData] = await Promise.all([
                    getActiveDeals(),
                    getImagesByCategory('hero'),
                    getImagesByCategory('gallery'),
                ]);
                if (dealsData.length > 0) {
                    setDeals(dealsData);
                }
                setHeroImages(heroImgsData);
                setGalleryImages(galleryImgsData);
            } catch (error) {
                console.error('Error loading data:', error);
                // Keep fallback deals if Firebase fails
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Image carousel
    useEffect(() => {
        const maxImages = heroImages.length > 0 ? heroImages.length : FALLBACK_IMAGES.length;

        const interval = setInterval(() => {
            setSelectedImage((prev) => (prev + 1) % maxImages);
        }, 4000); // כל 4 שניות

        return () => clearInterval(interval);
    }, [heroImages]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">

            {/* Hero Section - Improved Responsiveness */}
            <section className="relative h-[85vh] sm:h-[75vh] md:h-[70vh] min-h-[600px] sm:min-h-[500px] overflow-hidden">
                {/* Background Images */}
                <div className="absolute inset-0">
                    {(heroImages.length > 0 ? heroImages : FALLBACK_IMAGES.map((img, idx) => ({ storageUrl: img, id: `fallback-${idx}` }))).map((imgData, idx) => {
                        const src = typeof imgData === 'string' ? imgData : imgData.storageUrl;
                        const key = typeof imgData === 'string' ? imgData : imgData.id;
                        return (
                            <motion.img
                                key={key}
                                src={src}
                                alt={`וילת הדס ${idx + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: selectedImage === idx ? 1 : 0 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            />
                        );
                    })}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
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
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-6 sm:pt-8">
                            <Link
                                to="/contract"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                         px-8 sm:px-16 md:px-24 py-4 sm:py-6
                                         bg-green-500 hover:bg-green-600
                                         text-white font-bold text-base sm:text-lg md:text-xl
                                         rounded-full shadow-xl
                                         hover:shadow-2xl hover:scale-105
                                         transition-all duration-300 active:scale-95"
                            >
                                <Calendar className="w-5 h-5" />
                                הזמן עכשיו
                            </Link>
                            <a
                                href="tel:0503313193"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                         px-8 sm:px-16 md:px-24 py-4 sm:py-6
                                         bg-white dark:bg-slate-800 text-green-600 dark:text-green-400
                                         font-bold text-base sm:text-lg md:text-xl border-2 border-green-500
                                         rounded-full shadow-xl
                                         hover:shadow-2xl hover:scale-105
                                         transition-all duration-300 active:scale-95"
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
                        {(heroImages.length > 0 ? heroImages : FALLBACK_IMAGES).map((img, idx) => (
                            <button
                                key={typeof img === 'string' ? img : img.id}
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
                        <div className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5
                                      bg-gradient-to-r from-red-500 to-orange-500
                                      text-white rounded-full mb-4 text-sm sm:text-base font-bold shadow-lg">
                            🔥 מבצעים חמים
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold
                                     text-slate-900 dark:text-white mb-3 sm:mb-4">
                            חסכו עד 25% עכשיו!
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
                            מבצעים מוגבלים בזמן - אל תפספסו!
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {deals.length > 0 ? (
                                deals.map((deal, idx) => (
                                    <DealCard
                                        key={deal.id || idx}
                                        deal={deal}
                                        index={idx}
                                        icon={iconMap[deal.iconName] || Calendar}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-slate-600 dark:text-slate-400">אין מבצעים זמינים כרגע</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Limited Time Banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 sm:mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4
                                      bg-green-500
                                      text-white rounded-full shadow-lg text-sm sm:text-base font-bold">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>⏰ המבצעים תקפים עד סוף החודש בלבד!</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us - ENHANCED */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl font-display font-bold text-center mb-4
                                 text-slate-900 dark:text-white"
                    >
                        למה לבחור בנו?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-12 sm:mb-16 max-w-2xl mx-auto"
                    >
                        חוויית אירוח יוקרתית עם שירות אישי ומקצועי
                    </motion.p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {WHY_CHOOSE_US.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="group text-center"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6
                                              rounded-full flex items-center justify-center shadow-lg
                                              group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-500 to-cyan-500">
                                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3
                                             text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-display font-bold
                                     text-slate-900 dark:text-white mb-4">
                            מה מחכה לכם?
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            כל מה שאתם צריכים לחופשה מושלמת
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl
                                         shadow-lg hover:shadow-2xl transition-all duration-300
                                         hover:-translate-y-3 hover:scale-105 border-0
                                         overflow-hidden"
                            >
                                {/* Gradient accent circle */}
                                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.gradient}
                                              opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-full`}></div>

                                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient}
                                              rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg
                                              group-hover:scale-125 group-hover:shadow-2xl transition-all duration-300 relative z-10`}>
                                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white relative z-10">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-center
                                 mb-8 sm:mb-12 text-slate-900 dark:text-white">
                        גלריית תמונות
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {(galleryImages.length > 0 ? galleryImages : FALLBACK_IMAGES.map((img, idx) => ({ storageUrl: img, id: `fallback-gallery-${idx}` }))).map((imgData, idx) => {
                            const src = typeof imgData === 'string' ? imgData : imgData.storageUrl;
                            const key = typeof imgData === 'string' ? imgData : imgData.id;
                            return (
                                <motion.div
                                    key={key}
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
                                        src={src}
                                        alt={`וילת הדס ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="py-12 sm:py-16 md:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-display font-bold text-center
                                     text-slate-900 dark:text-white mb-4">
                            מה הלקוחות שלנו אומרים?
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                            חוות דעם מהמשפחות שחוו את הוילה
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {REVIEWS.map((review, idx) => (
                            <motion.div
                                key={review.name}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl
                                         shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105
                                         border-0"
                            >
                                {/* Gold accent */}
                                <div className="absolute top-0 right-0 text-4xl text-amber-300/20 font-serif">"</div>

                                <div className="flex items-center gap-1 mb-4 sm:mb-6 relative z-10">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 mb-6 leading-relaxed text-sm sm:text-base relative z-10">
                                    {review.text}
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500
                                                  rounded-full flex items-center justify-center text-xl sm:text-2xl
                                                  shadow-lg group-hover:scale-125 transition-all duration-300">
                                        {review.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                            {review.name}
                                        </div>
                                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
            <section className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-slate-800">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-display font-bold
                                     text-slate-900 dark:text-white mb-4">
                            צור קשר איתנו
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                            אנחנו כאן כדי לעזור ולענות לכל שאלה
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {[
                            { Icon: Phone, label: 'טלפון', value: '050-331-3193', href: 'tel:0503313193' },
                            { Icon: Mail, label: 'אימייל', value: 'vilathadass@gmail.com', href: 'mailto:vilathadass@gmail.com' },
                            { Icon: MapPin, label: 'כתובת', value: 'רחוב הדס 15, יבניאל', href: '#' },
                        ].map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={item.href}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex flex-col items-center gap-4 p-6 sm:p-8
                                         bg-slate-50 dark:bg-slate-700
                                         rounded-3xl border-0
                                         hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-lg"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600
                                              rounded-full flex items-center justify-center shadow-lg
                                              group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <item.Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                        {item.label}
                                    </p>
                                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        {item.value}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 sm:space-y-8"
                    >
                        <div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-4">
                                מוכנים לחוויה בלתי נשכחת?
                            </h2>
                            <p className="text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed">
                                הזמינו עכשיו וקבלו הנחה מיוחדת על השהות שלכם!
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contract"
                                className="inline-flex items-center justify-center gap-3 px-10 sm:px-18 md:px-24 py-4 sm:py-6 md:py-7
                                         bg-white text-green-600 font-bold text-base sm:text-lg md:text-xl
                                         rounded-full shadow-xl hover:shadow-2xl hover:scale-110 hover:bg-gray-50
                                         transition-all duration-300 active:scale-95"
                            >
                                <Calendar className="w-6 h-6" />
                                שמור מקום
                            </Link>
                            <a
                                href="tel:0503313193"
                                className="inline-flex items-center justify-center gap-3 px-10 sm:px-18 md:px-24 py-4 sm:py-6 md:py-7
                                         bg-white/20 backdrop-blur text-white font-bold text-base sm:text-lg md:text-xl border-2 border-white
                                         rounded-full shadow-xl hover:shadow-2xl hover:scale-110 hover:bg-white/30
                                         transition-all duration-300 active:scale-95"
                            >
                                <Phone className="w-6 h-6" />
                                התקשר
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white py-8 sm:py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm sm:text-base text-gray-300">
                        © 2025 וילת הדס. כל הזכויות שמורות.
                    </p>
                </div>
            </footer>
        </div>
    );
};