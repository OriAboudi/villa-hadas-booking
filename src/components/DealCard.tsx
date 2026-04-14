import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  index: number;
  icon: React.ComponentType<{ className?: string }>;
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
        <div className={`px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r ${deal.gradient}
                      text-white rounded-full shadow-lg text-xs sm:text-sm font-bold`}>
          {deal.badge}
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl
                   shadow-xl hover:shadow-2xl
                   border-0
                   overflow-hidden transition-all duration-300
                   hover:-translate-y-3 h-full"
      >
        {/* Header - gradient */}
        <div className={`bg-gradient-to-r ${deal.gradient} p-6 sm:p-8 text-white`}>
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
        <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
          {deal.features.map((feature) => (
            <div key={feature} className="flex items-center gap-3 sm:gap-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="p-6 sm:p-8 pt-0">
          <Link
            to="/contract"
            state={{ deal }}
            className={`w-full block text-center px-6 sm:px-8 py-3 sm:py-4
                      bg-green-500 hover:bg-green-600
                      text-white font-bold text-sm sm:text-base rounded-full
                      hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg`}
          >
            הזמן את המבצע
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
