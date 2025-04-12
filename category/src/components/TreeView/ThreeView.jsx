import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import applyColorsToTree from './applyColorsToTree';
import TreeNode from './TreeNode';
import TreeSearch from './TreeSearch';
import TreeActions from './TreeActions';
import AddCategory from './AddCategory';
import Modal from './Modal';
import CategoryFilter from './CategoryFilter';
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

    useEffect(() => {
        const rootCategoryIds = currentData.map(category => category.id);
        setSelectedCategories(rootCategoryIds);
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

    const filteredData = useMemo(() => {
        const categoryFiltered = currentData.filter(category =>
            selectedCategories.includes(category.id)
        );

        if (searchTerm.trim() === '') {
            return categoryFiltered;
        }

        return filterTreeBySearchTerm(categoryFiltered, searchTerm);
    }, [currentData, selectedCategories, searchTerm]);

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

    const toggleExpand = (id) => {
        setCurrentData(updateExpandedState(currentData, id));
    };

    const deleteItem = (id) => {
        const newData = cloneTreeWithoutItem(currentData, id);
        setCurrentData(newData);
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

    // Функции за drag & drop
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

                setSelectedCategories(prev => prev.filter(id => id !== draggedItem.id));
            }
        );

        setIsTrashHover(false);
        setDraggedItem(null);
        setIsDragging(false);
    };

    // Функции за модалните прозорци
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

            <CategoryFilter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={currentData}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleToggleCategory}
                onSelectAll={handleSelectAllCategories}
                onDeselectAll={handleDeselectAllCategories}
            />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <div className="flex">
                    <button
                        className="p-2 mr-2 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
                        onClick={handleAddRootCategory}
                    >
                        <Plus size={18} />
                    </button>
                    <button
                        className={`p-2 rounded-md hover:bg-gray-200 text-gray-700 transition-colors ${selectedCategories.length < currentData.length ? 'bg-blue-100' : 'bg-gray-100'}`}
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <Filter size={18} />
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
                        <p className="text-sm mt-1">Try changing your filter settings</p>
                    </div>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>* When dragging: use the trash icon to delete items, drop on other items to move them, or use the bottom drop area to make them top-level items</p>
            </div>
        </div>
    );
};

export default TreeView;