import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import applyColorsToTree from './applyColorsToTree';
import TreeNode from './TreeNode';
import TreeSearch from './TreeSearch';
import TreeActions from './TreeActions';
import AddCategory from './AddCategory';
import Modal from './Modal';
import SelectItem from './SelectItem.jsx';
import {
    updateExpandedState,
    cloneTreeWithoutItem,
    filterTreeBySearchTerm,
    updateItemColors,
    findItem,
    getColorFromPalette,
} from './utils';

const TreeView = ({ data, title = "Title" }) => {
    const [currentData, setCurrentData] = useState(applyColorsToTree(data));
    const [nextId, setNextId] = useState(1000);
    const [originalData] = useState(JSON.parse(JSON.stringify(data))); // Keep track of original data

    // Track changes
    const [modifiedCategories, setModifiedCategories] = useState([]);
    const [movedCategories, setMovedCategories] = useState([]);
    const [addedCategories, setAddedCategories] = useState([]);
    const [deletedCategories, setDeletedCategories] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [appliedCategoryFilter, setAppliedCategoryFilter] = useState([]);

    useEffect(() => {
        const rootCategoryIds = currentData.map(category => category.id);
        // Only initialize once when the component mounts or when currentData changes its structure
        if (selectedCategories.length === 0 || appliedCategoryFilter.length === 0) {
            setSelectedCategories(rootCategoryIds);
            setAppliedCategoryFilter(rootCategoryIds);
        }
    }, [currentData]);

    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [isRootDropAreaActive, setIsRootDropAreaActive] = useState(false);
    const [isTrashHover, setIsTrashHover] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {}
    });

    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [addingToParent, setAddingToParent] = useState(null);

    const filterCategoriesById = (items, allowedIds) => {
        return items.filter(item => allowedIds.includes(item.id));
    };

    const filteredData = useMemo(() => {
        const categoryFiltered = filterCategoriesById(currentData, appliedCategoryFilter);

        if (searchTerm.trim() === '') {
            return categoryFiltered;
        }

        return filterTreeBySearchTerm(categoryFiltered, searchTerm);
    }, [currentData, appliedCategoryFilter, searchTerm]);

    const showModal = (title, message, onConfirm) => {
        const confirmHandler = () => {
            onConfirm();
            setIsModalOpen(false);
        };

        setModalConfig({
            title,
            message,
            onConfirm: confirmHandler,
            onCancel: () => setIsModalOpen(false)
        });

        setIsModalOpen(true);
    };

    const handleToggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleSelectAllCategories = () => {
        const allRootIds = currentData.map(category => category.id);
        setSelectedCategories(allRootIds);
    };

    const handleDeselectAllCategories = () => {
        setSelectedCategories([]);
    };

    const handleApplyFilter = () => {
        setAppliedCategoryFilter(selectedCategories);
        setIsFilterOpen(false);
    };

    const toggleExpand = (id) => {
        const updatedFullData = updateExpandedState(currentData, id);
        setCurrentData(updatedFullData);
    };

    const deleteItem = (id) => {
        // Find the item and its parent before deleting
        const findItemAndParent = (items, id, parent = null) => {
            for (const item of items) {
                if (item.id === id) {
                    return { item, parent };
                }
                if (item.children && item.children.length > 0) {
                    const result = findItemAndParent(item.children, id, item);
                    if (result.item) return result;
                }
            }
            return { item: null, parent: null };
        };

        const { item, parent } = findItemAndParent(currentData, id);
        if (item) {
            // Track this deletion
            setDeletedCategories(prev => [...prev, {
                id,
                name: item.name,
                parentId: parent ? parent.id : null,
                parentName: parent ? parent.name : 'Root'
            }]);
        }

        const newData = cloneTreeWithoutItem(currentData, id);
        setCurrentData(newData);

        setSelectedCategories(prev => prev.filter(catId => catId !== id));
        setAppliedCategoryFilter(prev => prev.filter(catId => catId !== id));
    };

    const updateCategoryName = (id, newName) => {
        // Find the original item to get its old name
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

        const currentItem = findItem(currentData, id);
        if (currentItem) {
            // Track this modification
            setModifiedCategories(prev => {
                // Check if this category was already modified
                const existingIndex = prev.findIndex(item => item.id === id);
                if (existingIndex >= 0) {
                    // Update the existing entry
                    const updatedModifications = [...prev];
                    updatedModifications[existingIndex] = {
                        id,
                        oldName: updatedModifications[existingIndex].oldName, // Keep the original oldName
                        newName
                    };
                    return updatedModifications;
                } else {
                    // Add a new entry
                    return [...prev, { id, oldName: currentItem.name, newName }];
                }
            });
        }

        const updateName = (items) => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, name: newName };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateName(item.children)
                    };
                }
                return item;
            });
        };

        setCurrentData(updateName(currentData));
    };

    const addCategory = (parentId, categoryName) => {
        const newCategoryId = nextId;
        setNextId(nextId + 1);

        const parent = parentId ? findItem(currentData, parentId) : null;

        if (parentId && !parent) return;

        // Track this addition
        setAddedCategories(prev => [...prev, {
            id: newCategoryId,
            name: categoryName,
            parentId: parentId,
            parentName: parent ? parent.name : 'Root'
        }]);

        if (parentId) {
            const updateParentChildren = (items) => {
                return items.map(item => {
                    if (item.id === parentId) {
                        const newCategory = {
                            id: newCategoryId,
                            name: categoryName,
                            children: [],
                            color: item.color,
                            expanded: false
                        };

                        return {
                            ...item,
                            children: [...(item.children || []), newCategory],
                            expanded: true
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
        } else {
            const color = getColorFromPalette(currentData.length);

            const newCategory = {
                id: newCategoryId,
                name: categoryName,
                children: [],
                color: color,
                expanded: false
            };

            setCurrentData([...currentData, newCategory]);

            setSelectedCategories(prev => [...prev, newCategoryId]);
            setAppliedCategoryFilter(prev => [...prev, newCategoryId]);
        }
    };

    const isDraggedParentOfTarget = (draggedId, targetId) => {
        const draggedItem = findItem(currentData, draggedId);
        if (!draggedItem || !draggedItem.children || draggedItem.children.length === 0) {
            return false;
        }

        const isChild = (children, id) => {
            for (const child of children) {
                if (child.id === id) {
                    return true;
                }
                if (child.children && child.children.length > 0) {
                    if (isChild(child.children, id)) {
                        return true;
                    }
                }
            }
            return false;
        };

        return isChild(draggedItem.children, targetId);
    };

    const handleDragStart = (e, item) => {
        e.stopPropagation();
        setDraggedItem(item);
        setIsDragging(true);

        // Clear drag state when drag operation ends
        const handleDragEnd = () => {
            setDraggedItem(null);
            setIsDragging(false);
            setDropTarget(null);
            setIsRootDropAreaActive(false);
            document.removeEventListener('dragend', handleDragEnd);
        };

        document.addEventListener('dragend', handleDragEnd, { once: true });
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();

        if (!draggedItem ||
            item.id === draggedItem.id ||
            isDraggedParentOfTarget(draggedItem.id, item.id)) {
            return;
        }

        setDropTarget(item);
    };

    const handleDrop = (e, target) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedItem ||
            target.id === draggedItem.id ||
            isDraggedParentOfTarget(draggedItem.id, target.id)) {
            // Reset all drag-related states
            setDropTarget(null);
            setDraggedItem(null);
            setIsDragging(false);
            return;
        }

        // Find the current parent of the dragged item
        const findParent = (items, id, parent = null) => {
            for (const item of items) {
                if (item.children && item.children.some(child => child.id === id)) {
                    return item;
                }
                if (item.children && item.children.length > 0) {
                    const result = findParent(item.children, id, item);
                    if (result) return result;
                }
            }
            return parent;
        };

        const currentParent = findParent(currentData, draggedItem.id);

        showModal(
            "Confirm Move",
            `Are you sure you want to move "${draggedItem.name}" to "${target.name}"?`,
            () => {
                // Track this move
                setMovedCategories(prev => [...prev, {
                    id: draggedItem.id,
                    name: draggedItem.name,
                    fromParentId: currentParent ? currentParent.id : null,
                    fromParentName: currentParent ? currentParent.name : 'Root',
                    toParentId: target.id,
                    toParentName: target.name
                }]);

                const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);

                const updateTargetChildren = (items) => {
                    return items.map(item => {
                        if (item.id === target.id) {
                            const children = item.children || [];
                            const updatedDraggedItem = JSON.parse(JSON.stringify(draggedItem));

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
            }
        );

        setDropTarget(null);
        setDraggedItem(null);
        setIsDragging(false);
    };

    const handleRootDragOver = (e) => {
        e.preventDefault();
        if (draggedItem) {
            setIsRootDropAreaActive(true);
        }
    };

    const handleRootDragLeave = () => {
        setIsRootDropAreaActive(false);
    };

    const handleRootDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedItem) {
            setIsRootDropAreaActive(false);
            setIsDragging(false);
            return;
        }

        // Find the current parent of the dragged item
        const findParent = (items, id, parent = null) => {
            for (const item of items) {
                if (item.children && item.children.some(child => child.id === id)) {
                    return item;
                }
                if (item.children && item.children.length > 0) {
                    const result = findParent(item.children, id, item);
                    if (result) return result;
                }
            }
            return parent;
        };

        const currentParent = findParent(currentData, draggedItem.id);

        showModal(
            "Move to Root Level",
            `Are you sure you want to move "${draggedItem.name}" to the root level?`,
            () => {
                const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);
                const existsAtRoot = currentData.some(item => item.id === draggedItem.id);

                if (!existsAtRoot) {
                    // Track this move to root
                    setMovedCategories(prev => [...prev, {
                        id: draggedItem.id,
                        name: draggedItem.name,
                        fromParentId: currentParent ? currentParent.id : null,
                        fromParentName: currentParent ? currentParent.name : 'Root',
                        toParentId: null,
                        toParentName: 'Root'
                    }]);

                    const newRootItem = JSON.parse(JSON.stringify(draggedItem));
                    const color = getColorFromPalette(currentData.length);

                    updateItemColors(newRootItem, color);

                    if (!selectedCategories.includes(draggedItem.id)) {
                        setSelectedCategories(prev => [...prev, draggedItem.id]);
                    }

                    if (!appliedCategoryFilter.includes(draggedItem.id)) {
                        setAppliedCategoryFilter(prev => [...prev, draggedItem.id]);
                    }

                    setCurrentData([...dataWithoutDragged, newRootItem]);
                }
            }
        );

        setIsRootDropAreaActive(false);
        setDraggedItem(null);
        setIsDragging(false);
    };

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

        showModal(
            "Confirm Delete",
            `Are you sure you want to delete "${draggedItem.name}"?`,
            () => {
                deleteItem(draggedItem.id);
            }
        );

        setIsTrashHover(false);
        setDraggedItem(null);
        setIsDragging(false);
    };

    const handleAddCategory = (parentItem) => {
        setAddingToParent(parentItem);
        setAddCategoryModalOpen(true);
    };

    const handleAddRootCategory = () => {
        setAddingToParent(null);
        setAddCategoryModalOpen(true);
    };

    const handleAddCategoryConfirm = (parentId, categoryName) => {
        addCategory(parentId, categoryName);
        setAddCategoryModalOpen(false);
    };

    const isFilterActive = appliedCategoryFilter.length < currentData.length;

    // Handle saving all changes to the database
    const handleSaveChanges = () => {
        console.log("--- MODIFIED CATEGORIES ---");
        console.log(modifiedCategories);

        console.log("--- MOVED CATEGORIES ---");
        console.log(movedCategories);

        console.log("--- ADDED CATEGORIES ---");
        console.log(addedCategories);

        console.log("--- DELETED CATEGORIES ---");
        console.log(deletedCategories);

        // Check if there are any changes to save
        const hasChanges =
            modifiedCategories.length > 0 ||
            movedCategories.length > 0 ||
            addedCategories.length > 0 ||
            deletedCategories.length > 0;

        if (hasChanges) {
            alert("Changes saved successfully!");
            // Here you would typically send the changes to your backend

            // Reset tracking arrays after saving
            setModifiedCategories([]);
            setMovedCategories([]);
            setAddedCategories([]);
            setDeletedCategories([]);
        } else {
            alert("No changes to save.");
        }
    };

    return (
        <div className="w max-w-3xl bg-white rounded-lg shadow-md p-4">
            <Modal
                isOpen={isModalOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={modalConfig.onCancel}
            />

            <AddCategory
                isOpen={addCategoryModalOpen}
                parentItem={addingToParent}
                onAdd={handleAddCategoryConfirm}
                onCancel={() => setAddCategoryModalOpen(false)}
            />

            <SelectItem
                isOpen={isFilterOpen}
                onClose={() => {
                    // When closing without applying, reset to the last applied filter
                    setSelectedCategories(appliedCategoryFilter);
                    setIsFilterOpen(false);
                }}
                categories={currentData}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleToggleCategory}
                onSelectAll={handleSelectAllCategories}
                onDeselectAll={handleDeselectAllCategories}
                onApplyFilter={handleApplyFilter}
            />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex">
                    <button
                        className="p-2 mr-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
                        onClick={handleAddRootCategory}
                        title="Add new root category"
                    >
                        <Plus size={18} />
                    </button>
                    {/* Save Changes Button - Only visible when there are changes */}
                    {(modifiedCategories.length > 0 || movedCategories.length > 0 ||
                        addedCategories.length > 0 || deletedCategories.length > 0) && (
                        <button
                            className="mr-2 flex items-center px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
                            onClick={handleSaveChanges}
                            title="Save all changes"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            <span className="text-sm font-medium">Save Changes</span>
                        </button>
                    )}
                    <button
                        className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-600 text-white transition-colors ${isFilterActive ? 'bg-blue-600' : 'bg-blue-500'}`}
                        onClick={() => setIsFilterOpen(true)}
                        title="Select which categories to display"
                    >
                        <Filter size={18} className="mr-2" />
                        <span className="text-sm font-medium">Select Categories</span>
                    </button>
                </div>
            </div>

            <TreeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <TreeActions
                draggedItem={draggedItem}
                isTrashActive={isTrashHover}
                handleTrashDragOver={handleTrashDragOver}
                handleTrashDragLeave={handleTrashDragLeave}
                handleTrashDrop={handleTrashDrop}
            />

            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                {filteredData.length > 0 ? (
                    <>
                        {filteredData.map(item => (
                            <TreeNode
                                key={item.id}
                                item={item}
                                draggedItem={draggedItem}
                                dropTarget={dropTarget}
                                toggleExpand={toggleExpand}
                                handleDragStart={handleDragStart}
                                handleDragOver={handleDragOver}
                                handleDrop={handleDrop}
                                handleAddCategory={handleAddCategory}
                                allItems={currentData}
                                isDraggedParentOfTarget={isDraggedParentOfTarget}
                                isDragging={isDragging}
                                isFiltered={true}
                                updateCategoryName={updateCategoryName}
                            />
                        ))}

                        {isDragging && (
                            <div
                                className={`mt-2 p-2 border-2 rounded-md transition-all ${isRootDropAreaActive ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} cursor-pointer`}
                                onDragOver={handleRootDragOver}
                                onDragLeave={handleRootDragLeave}
                                onDrop={handleRootDrop}
                            >
                                <div className="text-center text-sm font-medium text-gray-500">
                                    Drop here to move to root level
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        <p>No categories to display</p>
                        <p className="text-sm mt-1">Try changing your category selection or search filters</p>
                    </div>
                )}
            </div>

            {isFilterActive && (
                <div className="mt-4 flex justify-between items-center py-2 px-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <span className="font-medium">Filter active:</span> Showing {appliedCategoryFilter.length} of {currentData.length} categories
                    </p>
                    <button
                        className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        Edit Selection
                    </button>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                <p>* When dragging: use the trash icon to delete items, drop on other items to move them, or use the bottom drop area to make them top-level items</p>
                <p>* Double-click on a category name to edit it</p>
            </div>
        </div>
    );
};

export default TreeView;