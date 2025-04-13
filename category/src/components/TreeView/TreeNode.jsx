import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Move, Plus, Check, X } from 'lucide-react';
import { countAllDescendants } from './utils';

const TreeNode = ({
                      item,
                      level = 0,
                      draggedItem,
                      dropTarget,
                      toggleExpand,
                      handleDragStart,
                      handleDragOver,
                      handleDrop,
                      handleAddCategory,
                      allItems,
                      isDraggedParentOfTarget,
                      isDragging,
                      isFiltered = false,
                      updateCategoryName
                  }) => {
    const isDropTarget = dropTarget?.id === item.id;
    const isThisItemDragged = draggedItem?.id === item.id;
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);

    const isValidDropTarget = !(
        !draggedItem ||
        draggedItem.id === item.id ||
        (draggedItem && isDraggedParentOfTarget(draggedItem.id, item.id))
    );

    const showDropTargetHighlight = isDropTarget && isValidDropTarget;

    const totalDescendants = countAllDescendants(item);

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        toggleExpand(item.id);
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (!isEditing) {
            setIsEditing(true);
            setEditedName(item.name);
        }
    };

    const handleInputChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (editedName.trim() !== '' && editedName !== item.name) {
                // Ask for confirmation
                if (window.confirm(`Do you want to change "${item.name}" to "${editedName}"?`)) {
                    updateCategoryName(item.id, editedName);
                } else {
                    setEditedName(item.name);
                }
            }
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setEditedName(item.name); // Reset to original name
            setIsEditing(false);
        }
    };

    const handleSaveEdit = () => {
        if (editedName.trim() !== '' && editedName !== item.name) {
            // Ask for confirmation
            if (window.confirm(`Do you want to change "${item.name}" to "${editedName}"?`)) {
                updateCategoryName(item.id, editedName);
            } else {
                setEditedName(item.name);
            }
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedName(item.name); // Reset to original name
        setIsEditing(false);
    };

    return (
        <div key={item.id} className={isThisItemDragged && isDragging ? 'opacity-50' : ''}>
            <div
                className={`flex items-center p-2 rounded-md mb-1 
                    ${showDropTargetHighlight ? 'bg-blue-100 border-2 border-blue-500' : ''}
                    ${draggedItem && !isValidDropTarget ? 'cursor-not-allowed' : ''}`}
                style={{
                    marginLeft: `${level * 20}px`,
                    borderLeft: `4px solid ${item.color}`,
                    backgroundColor: showDropTargetHighlight ? 'rgba(52, 152, 219, 0.1)' : 'white'
                }}
                onDragOver={(e) => {
                    e.preventDefault();

                    if (isValidDropTarget) {
                        handleDragOver(e, item);
                    }
                }}
                onDrop={(e) => {
                    e.preventDefault();

                    if (isValidDropTarget) {
                        handleDrop(e, item);
                    }
                }}
            >
                <div className="flex items-center flex-1">
                    <div
                        className="flex-shrink-0 w-4 h-4 flex items-center justify-center cursor-pointer"
                        onClick={handleToggleExpand}
                    >
                        {item.children && item.children.length > 0 ? (
                            item.expanded ?
                                <ChevronDown size={16} className="text-gray-700" /> :
                                <ChevronRight size={16} className="text-gray-700" />
                        ) : (
                            <div className="w-4"></div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="ml-2 flex items-center">
                            <input
                                type="text"
                                value={editedName}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                className="ml-2 p-1 bg-green-500 hover:bg-green-600 rounded-md text-white transition-all"
                                onClick={handleSaveEdit}
                            >
                                <Check size={14} />
                            </button>
                            <button
                                className="ml-1 p-1 bg-red-500 hover:bg-red-600 rounded-md text-white transition-all"
                                onClick={handleCancelEdit}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="ml-2 font-medium px-2 py-1 rounded-md cursor-pointer"
                            style={{
                                color: "#333333",
                                fontWeight: 700
                            }}
                            onDoubleClick={handleDoubleClick}
                        >
                            {item.name}
                        </div>
                    )}

                    {totalDescendants > 0 && !isEditing && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {totalDescendants}
                        </span>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex items-center">
                        <button
                            className="p-1.5 mr-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddCategory(item);
                            }}
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all shadow-sm cursor-grab active:cursor-grabbing"
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, item)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Move size={16} />
                        </button>
                    </div>
                )}
            </div>

            {item.expanded && item.children && item.children.length > 0 && (
                <div>
                    {item.children.map(child => (
                        <TreeNode
                            key={child.id}
                            item={child}
                            level={level + 1}
                            draggedItem={draggedItem}
                            dropTarget={dropTarget}
                            toggleExpand={toggleExpand}
                            handleDragStart={handleDragStart}
                            handleDragOver={handleDragOver}
                            handleDrop={handleDrop}
                            handleAddCategory={handleAddCategory}
                            allItems={allItems}
                            isDraggedParentOfTarget={isDraggedParentOfTarget}
                            isDragging={isDragging}
                            isFiltered={isFiltered}
                            updateCategoryName={updateCategoryName}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;