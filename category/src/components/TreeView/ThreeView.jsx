import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Move, Tag, Plus, Settings, Search, X, Check } from 'lucide-react';
import applyColorsToTree from "./applyColorsToTree.js";
import Modal from "./Modal";

const TreeView = ({
                      data,
                      title = "Title",
                  }) => {
    const [currentData, setCurrentData] = useState(applyColorsToTree(data));
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {}
    });
    const [isRootDropAreaActive, setIsRootDropAreaActive] = useState(false);

    // State for adding new category
    const [newCategoryName, setNewCategoryName] = useState('');
    const [addingToParent, setAddingToParent] = useState(null);
    const [nextId, setNextId] = useState(1000);

    const showModal = (title, message, onConfirm, modalContent = null) => {
        setModalConfig({
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setIsModalOpen(false);
            },
            onCancel: () => {
                setIsModalOpen(false);
                setNewCategoryName('');
            }
        });
        setModalContent(modalContent);
        setIsModalOpen(true);
    };

    const handleAddCategory = (parentItem) => {
        setAddingToParent(parentItem);
        setNewCategoryName('');

        const content = (
            <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                </label>
                <input
                    type="text"
                    id="categoryName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    autoFocus
                />
            </div>
        );

        showModal(
            "Add New Category",
            `Adding new category to "${parentItem.name}"`,
            () => {
                if (newCategoryName.trim()) {
                    addCategory(parentItem.id, newCategoryName);
                }
                setNewCategoryName('');
            },
            content
        );
    };

    const addCategory = (parentId, categoryName) => {
        const newCategoryId = nextId;
        setNextId(nextId + 1);

        const newCategory = {
            id: newCategoryId,
            name: categoryName,
            children: [],
            color: addingToParent.color, // Inherit parent's color
            expanded: false
        };

        const updateParentChildren = (items) => {
            return items.map(item => {
                if (item.id === parentId) {
                    return {
                        ...item,
                        children: [...(item.children || []), newCategory],
                        expanded: true // Auto-expand parent
                    };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateParentChildren(item.children)
                    };
                }
                return item;
            });
        };

        setCurrentData(updateParentChildren(currentData));
    };

    const handleAddRootCategory = () => {
        setNewCategoryName('');

        const content = (
            <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                </label>
                <input
                    type="text"
                    id="categoryName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    autoFocus
                />
            </div>
        );

        showModal(
            "Add Root Category",
            "Add a new top-level category",
            () => {
                if (newCategoryName.trim()) {
                    const newCategoryId = nextId;
                    setNextId(nextId + 1);

                    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
                    const color = colors[currentData.length % colors.length];

                    const newCategory = {
                        id: newCategoryId,
                        name: newCategoryName,
                        children: [],
                        color: color,
                        expanded: false
                    };

                    setCurrentData([...currentData, newCategory]);
                    setNewCategoryName('');
                }
            },
            content
        );
    };

    const getTextColor = (bgColor) => {
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
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

    // Function for cloning tree without specific item
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
            const isChild = findItem(draggedItem.children || [], item.id);
            if (!isChild) {
                setDropTarget(item);
            }
        }
    };

    // Handle drag over root area
    const handleRootDragOver = (e) => {
        e.preventDefault();
        if (draggedItem) {
            setIsRootDropAreaActive(true);
            setDropTarget(null);
        }
    };

    // Handle drag leave for root area
    const handleRootDragLeave = () => {
        setIsRootDropAreaActive(false);
    };

    // Handle drop on root area
    const handleRootDrop = (e) => {
        e.preventDefault();
        if (!draggedItem) {
            setIsRootDropAreaActive(false);
            return;
        }

        showModal(
            "Move to Root Level",
            `Are you sure you want to move "${draggedItem.name}" to the root level?`,
            () => {
                // Remove the item from its current location
                const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);

                // Check if it already exists at the root level
                const existsAtRoot = currentData.some(item => item.id === draggedItem.id);

                // If it's not already a root item, add it to root
                if (!existsAtRoot) {
                    // Create a new colors array for assigning colors to new root items
                    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
                    const color = colors[currentData.length % colors.length];

                    // Create a deep copy of the dragged item
                    const newRootItem = JSON.parse(JSON.stringify(draggedItem));

                    // Function to recursively update colors
                    const updateItemColors = (item, newColor) => {
                        item.color = newColor;
                        if (item.children && item.children.length > 0) {
                            item.children.forEach(child => updateItemColors(child, newColor));
                        }
                    };

                    // Update colors for the root item and all its descendants
                    updateItemColors(newRootItem, color);

                    // Add the item to the root level
                    setCurrentData([...dataWithoutDragged, newRootItem]);
                }
            }
        );

        setIsRootDropAreaActive(false);
        setDraggedItem(null);
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        if (!draggedItem || target.id === draggedItem.id) {
            setDropTarget(null);
            setDraggedItem(null);
            return;
        }

        // Show modal dialog instead of confirm
        showModal(
            "Confirm Move",
            `Are you sure you want to move "${draggedItem.name}" to "${target.name}"?`,
            () => {
                // Code for moving on confirmation
                const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);

                const updateTargetChildren = (items) => {
                    return items.map(item => {
                        if (item.id === target.id) {
                            const children = item.children || [];
                            // Update draggedItem and all its children to have the same color as the new parent
                            // First, make a deep copy of the draggedItem
                            const updatedDraggedItem = JSON.parse(JSON.stringify(draggedItem));

                            // Function to recursively update colors
                            const updateItemColors = (item, newColor) => {
                                item.color = newColor;
                                if (item.children && item.children.length > 0) {
                                    item.children.forEach(child => updateItemColors(child, newColor));
                                }
                            };

                            // Update colors for the dragged item and all its descendants
                            updateItemColors(updatedDraggedItem, target.color);
                            updatedDraggedItem.parentId = target.id;

                            return {
                                ...item,
                                children: [...children, updatedDraggedItem],
                                expanded: true
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
            }
        );

        // These will execute immediately, regardless of confirmation
        setDropTarget(null);
        setDraggedItem(null);
    };

    // Filter the data based on search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm.trim()) return currentData;

        // Recursive function to search through the tree
        const filterItems = (items) => {
            return items.reduce((filtered, item) => {
                // Check if the current item matches
                const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

                // Filter children recursively
                let filteredChildren = [];
                if (item.children && item.children.length > 0) {
                    filteredChildren = filterItems(item.children);
                }

                // Include the item if it matches or has matching children
                if (matchesSearch || filteredChildren.length > 0) {
                    return [...filtered, {
                        ...item,
                        expanded: filteredChildren.length > 0 ? true : item.expanded, // Auto-expand if has matching children
                        children: filteredChildren
                    }];
                }

                return filtered;
            }, []);
        };

        return filterItems(currentData);
    }, [currentData, searchTerm]);

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

        // Show modal dialog instead of alert
        showModal(
            "Confirm Delete",
            `Are you sure you want to delete "${draggedItem.name}"?`,
            () => {
                const newData = cloneTreeWithoutItem(currentData, draggedItem.id);
                setCurrentData(newData);
                setIsTrashHover(false);
                setDraggedItem(null);
            }
        );

        setIsTrashHover(false);
        setDraggedItem(null);
    };

    return (
        <div className="w max-w-3xl bg-white rounded-lg shadow-md p-4">
            <Modal
                isOpen={isModalOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={modalConfig.onCancel}
            >
                {modalContent}
            </Modal>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex">
                    <button
                        className="p-2 mr-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
                        onClick={handleAddRootCategory}
                    >
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

            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">Use <Move size={14} className="inline text-gray-600 mx-1"/> icon to drag items</span>
                </div>

                <div className="flex space-x-3">
                    {/* New Root Drop Area */}
                    <div
                        className={`flex items-center p-2 rounded-md transition-all ${isRootDropAreaActive ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'} ${draggedItem ? 'border-2 border-dashed border-green-400' : ''}`}
                        onDragOver={handleRootDragOver}
                        onDragLeave={handleRootDragLeave}
                        onDrop={handleRootDrop}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isRootDropAreaActive ? "#27ae60" : "#000"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-all ${isRootDropAreaActive ? 'scale-110' : ''}`}
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        <span className={`ml-2 ${isRootDropAreaActive ? 'text-green-600 font-medium' : 'text-gray-600 font-medium'}`}>
                            Move to root
                        </span>
                    </div>

                    {/* Trash Drop Area */}
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
            </div>

            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                {filteredData.map(item => renderTreeItem(item))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>* Drag items to the trash to delete them, to other items to move them, or to "Move to root" to make them top-level items</p>
            </div>
        </div>
    );
};

export default TreeView;