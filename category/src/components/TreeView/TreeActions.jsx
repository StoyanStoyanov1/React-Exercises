import React from 'react';
import { Move } from 'lucide-react';

export const TrashDropArea = ({
                                  isActive,
                                  draggedItem,
                                  onDragOver,
                                  onDragLeave,
                                  onDrop
                              }) => {
    return (
        <div
            className={`flex items-center p-2 rounded-md transition-all ${isActive ? 'bg-red-100' : 'bg-gray-100'} ${draggedItem ? 'border-2 border-dashed border-red-400' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? "#e74c3c" : "#000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all ${isActive ? 'scale-110' : ''}`}
            >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span className={`ml-2 ${isActive ? 'text-red-500 font-medium' : 'text-gray-600 font-medium'}`}>
                Delete item
            </span>
        </div>
    );
};

const TreeActions = ({
                         draggedItem,
                         isTrashActive,
                         handleTrashDragOver,
                         handleTrashDragLeave,
                         handleTrashDrop
                     }) => {
    return (
        <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-gray-700">
                    Use <Move size={14} className="inline text-gray-600 mx-1"/> icon to drag items
                </span>
            </div>

            {draggedItem && (
                <div className="flex space-x-3">
                    <TrashDropArea
                        isActive={isTrashActive}
                        draggedItem={draggedItem}
                        onDragOver={handleTrashDragOver}
                        onDragLeave={handleTrashDragLeave}
                        onDrop={handleTrashDrop}
                    />
                </div>
            )}
        </div>
    );
};

export default TreeActions;