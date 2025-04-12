import React, { useEffect } from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, children }) => {
    useEffect(() => {
        // Handle escape key to close modal
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Prevent scrolling of body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                 onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                    {children}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;