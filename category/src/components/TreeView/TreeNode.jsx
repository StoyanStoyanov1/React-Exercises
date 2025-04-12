import React from 'react';
import { ChevronDown, ChevronRight, Move, Plus } from 'lucide-react';
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
                      isFiltered = false
                  }) => {
    const isDropTarget = dropTarget?.id === item.id;
    const isThisItemDragged = draggedItem?.id === item.id;

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
                <div className="flex items-center flex-1" onClick={handleToggleExpand}>
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center cursor-pointer" onClick={handleToggleExpand}>
                        {item.children && item.children.length > 0 ? (
                            item.expanded ?
                                <ChevronDown size={16} className="text-gray-700" /> :
                                <ChevronRight size={16} className="text-gray-700" />
                        ) : (
                            <div className="w-4"></div>
                        )}
                    </div>
                    <div
                        className="ml-2 font-medium px-2 py-1 rounded-md cursor-pointer"
                        style={{
                            color: "#333333",
                            fontWeight: 700
                        }}
                        onClick={handleToggleExpand}
                    >
                        {item.name}
                    </div>
                    {totalDescendants > 0 && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {totalDescendants}
                        </span>
                    )}
                </div>

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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;