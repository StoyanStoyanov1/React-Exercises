import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { countAllDescendants } from './utils';

const SelectItem = ({
                        isOpen,
                        onClose,
                        categories,
                        selectedCategories,
                        onCategoryToggle,
                        onSelectAll,
                        onDeselectAll,
                        onApplyFilter
                    }) => {
    // Добавяме обработка на клавишите Escape и Enter
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen) {
                if (e.key === 'Escape') {
                    onClose();
                } else if (e.key === 'Enter') {
                    const activeElement = document.activeElement;
                    const isInputField = activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA';

                    if (!isInputField) {
                        onApplyFilter();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent scrolling of the body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, onApplyFilter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Select Categories</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-4 flex space-x-2">
                    <button
                        onClick={onSelectAll}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Select All
                    </button>
                    <button
                        onClick={onDeselectAll}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                    >
                        Clear All
                    </button>
                </div>

                <div className="space-y-2">
                    {categories.map(category => {
                        const totalDescendants = countAllDescendants(category);
                        const isSelected = selectedCategories.includes(category.id);

                        return (
                            <div
                                key={category.id}
                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors
                                    ${isSelected ? 'border-l-4' : 'border-l-4 border-transparent'}`}
                                style={{
                                    borderLeftColor: isSelected ? category.color : 'transparent'
                                }}
                                onClick={() => onCategoryToggle(category.id)}
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 
                                    ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300'}`}
                                >
                                    {isSelected && <Check size={14} />}
                                </div>

                                <div className="flex-1">
                                    <span className="font-medium" style={{ color: '#333333' }}>
                                        {category.name}
                                    </span>
                                    {totalDescendants > 0 && (
                                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                            {totalDescendants}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onApplyFilter}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Apply Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectItem;