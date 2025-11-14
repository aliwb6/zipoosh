import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ 
  type = 'success', 
  message, 
  isVisible, 
  onClose,
  duration = 3000,
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = types[type];

  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColor} ${borderColor} border-r-4 p-4 rounded-lg shadow-lg max-w-md fade-in`}>
        <div className="flex items-start gap-3">
          <Icon className={`${iconColor} flex-shrink-0`} size={24} />
          <p className={`${textColor} flex-1`}>{message}</p>
          <button 
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity`}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;