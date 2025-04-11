import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Move, Tag, Plus, Settings, Search } from 'lucide-react';
import applyColorsToTree from "./applyColorsToTree.js";

const TreeView = ({
                      data,
                      title = "Item Management",
                  }) => {
    const [currentData, setCurrentData] = useState(applyColorsToTree(data));
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to determine contrasting text color
    const getTextColor = (bgColor) => {
        // Convert hex color to RGB
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);

            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        };

        const rgb = hexToRgb(bgColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

        return brightness > 125 ? '#000000' : '#ffffff';
    };

    const toggleExpand = (id) => {
        const updateExpanded = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, expanded: !item.expanded };
                } else if (item.children && item.children.length > 0) {
                    return { ...item, children: updateExpanded(item.children) };
                }
                return item;
            });
        };

        setCurrentData(updateExpanded(currentData));
    };

    // Функция за намиране на родител на елемент по ID
    const findParent = (items, id, parent = null) => {
        for (const item of items) {
            if (item.id === id) {
                return parent;
            }
            if (item.children && item.children.length > 0) {
                const foundParent = findParent(item.children, id, item);
                if (foundParent) return foundParent;
            }
        }
        return null;
    };

    // Функция за намиране на елемент по ID
    const findItem = (items, id) => {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const foundItem = findItem(item.children, id);
                if (foundItem) return foundItem;
            }
        }
        return null;
    };

    // Функция за клониране на дърво без определен елемент
    const cloneTreeWithoutItem = (items, id) => {
        return items.reduce((acc, item) => {
            if (item.id === id) {
                return acc;
            }

            const newItem = { ...item };
            if (item.children && item.children.length > 0) {
                newItem.children = cloneTreeWithoutItem(item.children, id);
            }

            return [...acc, newItem];
        }, []);
    };

    const handleDragStart = (e, item) => {
        e.stopPropagation();
        setDraggedItem(item);
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();
        if (draggedItem && item.id !== draggedItem.id) {
            // Check if the target is not a child of the dragged item
            const isChild = findItem(draggedItem.children || [], item.id);
            if (!isChild) {
                setDropTarget(item);
            }
        }
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        if (!draggedItem || target.id === draggedItem.id) {
            setDropTarget(null);
            setDraggedItem(null);
            return;
        }

        // Step 1: Create a copy of the data structure without the dragged item
        const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);

        // Step 2: Find the target in the new structure
        const updateTargetChildren = (items) => {
            return items.map(item => {
                if (item.id === target.id) {
                    // Add the dragged item to this target's children
                    const children = item.children || [];
                    return {
                        ...item,
                        children: [...children, { ...draggedItem, parentId: target.id }],
                        expanded: true // Auto-expand the target
                    };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateTargetChildren(item.children)
                    };
                }
                return item;
            });
        };

        const newData = updateTargetChildren(dataWithoutDragged);
        setCurrentData(newData);

        setDropTarget(null);
        setDraggedItem(null);

        // Show confirmation
        alert(`Moved "${draggedItem.name}" to "${target.name}"`);
    };

    const renderTreeItem = (item, level = 0) => {
        const isDropTarget = dropTarget?.id === item.id;
        const isDragging = draggedItem?.id === item.id;
        const textColor = getTextColor(item.color);

        return (
            <div key={item.id} className={isDragging ? 'opacity-50' : ''}>
                <div
                    className={`flex items-center p-2 rounded-md mb-1 ${isDropTarget ? 'bg-blue-100 border-2 border-blue-500' : ''}`}
                    style={{
                        marginLeft: `${level * 20}px`,
                        borderLeft: `4px solid ${item.color}`,
                        backgroundColor: isDropTarget ? 'rgba(52, 152, 219, 0.1)' : 'white'
                    }}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDrop={(e) => handleDrop(e, item)}
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
                                backgroundColor: item.color,
                                color: textColor,
                                fontWeight: 500
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
                        <button className="p-1.5 mr-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all shadow-sm">
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
                        {item.children.map(child => renderTreeItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const [isTrashHover, setIsTrashHover] = useState(false);

    const handleTrashDragOver = (e) => {
        e.preventDefault();
        setIsTrashHover(true);
    };

    const handleTrashDragLeave = () => {
        setIsTrashHover(false);
    };

    const handleTrashDrop = (e) => {
        e.preventDefault();

        if (!draggedItem) {
            setIsTrashHover(false);
            return;
        }

        const newData = cloneTreeWithoutItem(currentData, draggedItem.id);
        setCurrentData(newData);

        alert(`"${draggedItem.name}" has been deleted!`);

        setIsTrashHover(false);
        setDraggedItem(null);
    };

    return (
        <div className="w max-w-3xl bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex">
                    <button className="p-2 mr-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700">
                        <Plus size={18} />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Use <Move size={14} className="inline text-gray-600 mx-1"/> icon to drag items</span>
                </div>

                <div
                    className={`flex items-center p-2 rounded-md transition-all ${isTrashHover ? 'bg-red-100' : 'bg-gray-100'} ${draggedItem ? 'border-2 border-dashed border-red-400' : ''}`}
                    onDragOver={handleTrashDragOver}
                    onDragLeave={handleTrashDragLeave}
                    onDrop={handleTrashDrop}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isTrashHover ? "#e74c3c" : "#000"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-all ${isTrashHover ? 'scale-110' : ''}`}
                    >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    <span className={`ml-2 ${isTrashHover ? 'text-red-500 font-medium' : 'text-gray-600 font-medium'}`}>
                        Delete item
                    </span>
                </div>
            </div>

            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                {currentData.map(item => renderTreeItem(item))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>* Drag items to the trash to delete them or onto other items to move them</p>
            </div>
        </div>
    );
};

export default TreeView;