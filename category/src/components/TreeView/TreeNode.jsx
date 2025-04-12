import React from 'react';
import { ChevronDown, ChevronRight, Move, Tag, Plus } from 'lucide-react';

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
                      isDragging
                  }) => {
    const isDropTarget = dropTarget?.id === item.id;
    const isThisItemDragged = draggedItem?.id === item.id;

    // Проверяваме дали текущият елемент е валидна drop цел
    // Невалиден е когато:
    // 1. Влачим елемент върху себе си
    // 2. Влачим родител върху свое дете
    const isValidDropTarget = !(
        !draggedItem ||
        draggedItem.id === item.id ||
        (draggedItem && isDraggedParentOfTarget(draggedItem.id, item.id))
    );

    // Показваме подсветка само ако е валидна цел
    const showDropTargetHighlight = isDropTarget && isValidDropTarget;

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
                    // Прихващаме събитието за всички елементи, но обработваме само за валидни цели
                    e.preventDefault(); // Винаги предотвратяваме default за правилна drag-and-drop функционалност

                    if (isValidDropTarget) {
                        handleDragOver(e, item);
                    }
                }}
                onDrop={(e) => {
                    // Прихващаме събитието за всички елементи, но обработваме само за валидни цели
                    e.preventDefault(); // Винаги предотвратяваме default

                    if (isValidDropTarget) {
                        handleDrop(e, item);
                    }
                }}
            >
                <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                    {item.children && item.children.length > 0 ? (
                        item.expanded ?
                            <ChevronDown size={16} className="text-gray-700" /> :
                            <ChevronRight size={16} className="text-gray-700" />
                    ) : (
                        <div className="w-4"></div>
                    )}
                    <div
                        className="ml-2 font-medium px-2 py-1 rounded-md"
                        style={{
                            color: item.color,
                            fontWeight: 700
                        }}
                    >
                        {item.name}
                    </div>
                    {item.children && item.children.length > 0 && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {item.children.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center">
                    <button className="p-1.5 mr-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all shadow-sm">
                        <Tag size={16} />
                    </button>
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
                    >
                        <Move size={16} />
                    </button>
                </div>
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;