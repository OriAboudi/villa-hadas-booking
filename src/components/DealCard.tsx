import { motion } from 'framer-motion';
import { CheckCircle, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  index: number;
  icon: LucideIcon;
}

export const DealCard = ({ deal, index, icon: Icon }: DealCardProps) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Badge */}
      <div className="absolute -top-3 -right-3 z-10">
        <div
          className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${deal.gradient}
                      text-white rounded-full shadow-xl text-xs sm:text-sm font-bold
                      animate-pulse`}
        >
          {deal.badge}
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl
                   shadow-xl hover:shadow-2xl
                   border-2 border-slate-200 dark:border-slate-700
                   overflow-hidden transition-all duration-300
                   hover:-translate-y-2 h-full"
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${deal.gradient} p-4 sm:p-6 text-white`}>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">{deal.title}</h3>
              <p className="text-white/90 text-xs sm:text-sm">{deal.description}</p>
            </div>
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 sm:gap-3">
            <div>
              <div className="text-xs sm:text-sm text-white/80 line-through">
                ₪{deal.originalPrice}
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black">
                ₪{deal.salePrice}
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
  );
};
