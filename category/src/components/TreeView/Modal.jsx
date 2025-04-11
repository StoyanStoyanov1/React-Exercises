import {X} from "lucide-react";
import React from "react";

export const Modal = ({ isOpen, title, message, onConfirm, onCancel, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden transform transition-all">
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onCancel}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="px-6 py-4">
                    {message && <p className="text-gray-700 mb-4">{message}</p>}
                    {children}
                </div>
                <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

