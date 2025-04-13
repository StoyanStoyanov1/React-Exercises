import React, { useEffect } from 'react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, children }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen) {
                if (e.key === 'Escape') {
                    onCancel();
                } else if (e.key === 'Enter') {
                    const activeElement = document.activeElement;
                    const isInputOrTextarea = activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA';

                    if (!isInputOrTextarea) {
                        onConfirm();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onCancel, onConfirm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onCancel}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                 onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>

                <div className="px-6 py-4">
                    {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                    {children}
                </div>

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