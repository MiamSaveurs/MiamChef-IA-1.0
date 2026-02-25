import React from 'react';
import { X } from 'lucide-react';

interface InAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const InAppMessageModal: React.FC<InAppMessageModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-slide-up">
        {/* Close Icon (Optional, but good UX) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display text-chef-green">{title}</h2>
          
          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
            {message}
          </div>

          <div className="pt-4 space-y-3">
            {/* Optional Action Button */}
            {actionLabel && onAction && (
              <button
                onClick={() => {
                  onAction();
                  onClose();
                }}
                className="w-full py-3 bg-chef-green hover:bg-chef-green/90 text-white font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-chef-green/20"
              >
                {actionLabel}
              </button>
            )}

            {/* Standard OK Button */}
            <button
              onClick={onClose}
              className={`w-full py-3 font-medium rounded-xl transition-colors ${
                actionLabel 
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                  : 'bg-chef-green hover:bg-chef-green/90 text-white shadow-lg shadow-chef-green/20'
              }`}
            >
              OK, compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InAppMessageModal;
