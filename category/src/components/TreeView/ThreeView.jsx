import React, { useState, useMemo } from 'react';
import { Plus, Settings } from 'lucide-react';
import applyColorsToTree from './applyColorsToTree';
import TreeNode from './TreeNode';
import TreeSearch from './TreeSearch';
import TreeActions from './TreeActions';
import AddCategory from './AddCategory';
import Modal from './Modal';
import {
    updateExpandedState,
    cloneTreeWithoutItem,
    filterTreeBySearchTerm,
    updateItemColors,
    findItem,
    getColorFromPalette,
    isDescendantOf
} from './utils';

const TreeView = ({ data, title = "Title" }) => {
    // Основни данни
    const [currentData, setCurrentData] = useState(applyColorsToTree(data));
    const [nextId, setNextId] = useState(1000);

    // Състояние за търсене
    const [searchTerm, setSearchTerm] = useState('');

    // Състояние за drag & drop
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [isRootDropAreaActive, setIsRootDropAreaActive] = useState(false);
    const [isTrashHover, setIsTrashHover] = useState(false);

    // Състояние за модални прозорци
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {}
    });

    // Състояние за добавяне на категория
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [addingToParent, setAddingToParent] = useState(null);

    // Филтрирани данни според търсенето
    const filteredData = useMemo(() => {
        return filterTreeBySearchTerm(currentData, searchTerm);
    }, [currentData, searchTerm]);

    // Функция за показване на модален прозорец
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

    // Функции за управление на дървото
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
            // Добавяне на дете към съществуваща категория
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
            // Добавяне на категория на най-горно ниво
            const color = getColorFromPalette(currentData.length);

            const newCategory = {
                id: newCategoryId,
                name: categoryName,
                children: [],
                color: color,
                expanded: false
            };

            setCurrentData([...currentData, newCategory]);
        }
    };

    // Проверява дали влаченият елемент е родител на целевия елемент
    const isDraggedParentOfTarget = (draggedId, targetId) => {
        // Намираме драгнатия елемент
        const draggedItem = findItem(currentData, draggedId);
        if (!draggedItem || !draggedItem.children || draggedItem.children.length === 0) {
            return false;
        }

        // Рекурсивно проверяваме дали targetId е в децата на draggedItem
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
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();

        // Не позволяваме влачене върху себе си или към свое дете
        if (!draggedItem ||
            item.id === draggedItem.id ||
            isDraggedParentOfTarget(draggedItem.id, item.id)) {
            return;
        }

        setDropTarget(item);
    };

    const handleDrop = (e, target) => {
        e.preventDefault();

        // Не позволяваме дроп върху себе си или върху свое дете
        if (!draggedItem ||
            target.id === draggedItem.id ||
            isDraggedParentOfTarget(draggedItem.id, target.id)) {
            setDropTarget(null);
            setDraggedItem(null);
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

                    setCurrentData([...dataWithoutDragged, newRootItem]);
                }
            }
        );

        setIsRootDropAreaActive(false);
        setDraggedItem(null);
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

            <TreeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <TreeActions
                draggedItem={draggedItem}
                isTrashActive={isTrashHover}
                handleTrashDragOver={handleTrashDragOver}
                handleTrashDragLeave={handleTrashDragLeave}
                handleTrashDrop={handleTrashDrop}
            />

            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
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
                    />
                ))}

                {/* Root drop area at the bottom - only visible when dragging */}
                {draggedItem && (
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
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>* When dragging: use the trash icon to delete items, drop on other items to move them, or use the bottom drop area to make them top-level items</p>
            </div>
        </div>
    );
};

export default TreeView;