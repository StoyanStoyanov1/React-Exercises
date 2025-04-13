import React, { useState } from 'react';
import Modal from './Modal';

export const CategoryForm = ({
                                 categoryName,
                                 setCategoryName,
                                 onConfirm,
                                 onCancel,
                                 onEnterPress
                             }) => {
    return (
        <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
            </label>
            <input
                type="text"
                id="categoryName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && onEnterPress) {
                        onEnterPress();
                    }
                }}
            />
            <div className="flex justify-end space-x-3 mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                    onClick={onConfirm}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

const AddCategory = ({
                         isOpen,
                         parentItem = null,
                         onAdd,
                         onCancel
                     }) => {
    const [categoryName, setCategoryName] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (categoryName.trim()) {
            setShowConfirmation(true);
        }
    };

    const handleEnterPress = () => {
        if (categoryName.trim()) {
            handleConfirm();
        }
    };

    const handleConfirmAdd = () => {
        onAdd(parentItem ? parentItem.id : null, categoryName);
        setCategoryName('');
        setShowConfirmation(false);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };

    const confirmationMessage = parentItem
        ? `Do you want to create "${categoryName}" in the "${parentItem.name}" category?`
        : `Do you want to create "${categoryName}" in the root directory?`;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onCancel}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {parentItem ? `Add to "${parentItem.name}"` : "Add Root Category"}
                </h2>

                <CategoryForm
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    onConfirm={handleConfirm}
                    onCancel={onCancel}
                    onEnterPress={handleEnterPress}
                />

                {/* Confirmation Modal */}
                <Modal
                    isOpen={showConfirmation}
                    title="Confirm Category Creation"
                    message={confirmationMessage}
                    onConfirm={handleConfirmAdd}
                    onCancel={handleCancelConfirmation}
                />
            </div>
        </div>
    );
};

export default AddCategory;