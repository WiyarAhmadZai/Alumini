import React, { useEffect } from 'react';

const Modal = ({ isOpen, title, onClose, children, footer = null, widthClassName = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widthClassName} bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/60 animate-[modalIn_160ms_ease-out]`}
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-gray-900 font-bold text-lg truncate pr-4">{title}</h3>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="px-6 py-5 overflow-auto" style={{ maxHeight: footer ? 'calc(100vh - 12rem)' : 'calc(100vh - 8.5rem)' }}>
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: translateY(8px) scale(0.99); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
