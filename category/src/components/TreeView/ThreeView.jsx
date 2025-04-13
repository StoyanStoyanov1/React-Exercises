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
        const newData = cloneTreeWithoutItem(currentData, id);
        setCurrentData(newData);

        setSelectedCategories(prev => prev.filter(catId => catId !== id));
        setAppliedCategoryFilter(prev => prev.filter(catId => catId !== id));
    };

    const updateCategoryName = (id, newName) => {
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

        if (!draggedItem ||
            target.id === draggedItem.id ||
            isDraggedParentOfTarget(draggedItem.id, target.id)) {
            setDropTarget(null);
            setDraggedItem(null);
            setIsDragging(false);
            return;
        }

        showModal(
            "Confirm Move",
            `Are you sure you want to move "${draggedItem.name}" to "${target.name}"?`,
            () => {
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
        if (!draggedItem) {
            setIsRootDropAreaActive(false);
            return;
        }

        showModal(
            "Move to Root Level",
            `Are you sure you want to move "${draggedItem.name}" to the root level?`,
            () => {
                const dataWithoutDragged = cloneTreeWithoutItem(currentData, draggedItem.id);
                const existsAtRoot = currentData.some(item => item.id === draggedItem.id);

                if (!existsAtRoot) {
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