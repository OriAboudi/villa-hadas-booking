import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'טוען...' }: LoadingSpinnerProps) => (
  <div className="flex flex-col items-center justify-center py-12">
    <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mb-4" />
    <p className="text-slate-600 dark:text-slate-400 text-lg">{message}</p>
  </div>
);
