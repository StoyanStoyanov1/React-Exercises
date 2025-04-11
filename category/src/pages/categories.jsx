import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Move, Tag, Plus, Settings, Search } from 'lucide-react';

const CategorySystem = () => {
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Електроника',
            color: '#3498db',
            expanded: true,
            children: [
                {
                    id: 2,
                    name: 'Смартфони',
                    color: '#3498db',
                    expanded: false,
                    children: [
                        { id: 6, name: 'Apple', color: '#3498db', children: [] },
                        { id: 7, name: 'Samsung', color: '#3498db', children: [] },
                        { id: 8, name: 'Xiaomi', color: '#3498db', children: [] },
                    ]
                },
                {
                    id: 3,
                    name: 'Компютри',
                    color: '#3498db',
                    expanded: false,
                    children: [
                        { id: 9, name: 'Лаптопи', color: '#3498db', children: [] },
                        { id: 10, name: 'Десктопи', color: '#3498db', children: [] },
                    ]
                },
            ]
        },
        {
            id: 4,
            name: 'Дрехи',
            color: '#e74c3c',
            expanded: true,
            children: [
                {
                    id: 5,
                    name: 'Мъжки',
                    color: '#e74c3c',
                    expanded: true,
                    children: [
                        { id: 11, name: 'Тениски', color: '#e74c3c', children: [] },
                        { id: 12, name: 'Панталони', color: '#e74c3c', children: [] },
                    ]
                },
                { id: 13, name: 'Дамски', color: '#e74c3c', children: [] },
                { id: 14, name: 'Детски', color: '#e74c3c', children: [] },
            ]
        },
        {
            id: 15,
            name: 'Храни',
            color: '#2ecc71',
            expanded: false,
            children: []
        }
    ]);

    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

        setCategories(updateExpanded(categories));
    };

    const handleDragStart = (item) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e, item) => {
        e.preventDefault();
        if (item.id !== draggedItem?.id) {
            setDropTarget(item);
        }
    };

    const handleDrop = (e, targetItem) => {
        e.preventDefault();
        // In a real application, this would update the data structure
        // by removing the draggedItem from its original location
        // and adding it to the children of targetItem
        setDropTarget(null);
        setDraggedItem(null);

        // Show demo notification
        alert(`Преместване на "${draggedItem?.name}" в "${targetItem.name}"`);
    };

    const renderCategoryItem = (item, level = 0) => {
        const isDropTarget = dropTarget?.id === item.id;
        const isDragging = draggedItem?.id === item.id;

        return (
            <div key={item.id}>
                <div
                    className={`flex items-center p-2 rounded-md mb-1 ${isDropTarget ? 'bg-blue-100 border-2 border-blue-500' : ''} ${isDragging ? 'opacity-50' : ''}`}
                    style={{
                        marginLeft: `${level * 20}px`,
                        borderLeft: `4px solid ${item.color}`,
                        backgroundColor: isDropTarget ? 'rgba(52, 152, 219, 0.1)' : 'white'
                    }}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDrop={(e) => handleDrop(e, item)}
                >
                    <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                        {item.children && item.children.length > 0 ? (
                            item.expanded ?
                                <ChevronDown size={16} className="text-gray-500" /> :
                                <ChevronRight size={16} className="text-gray-500" />
                        ) : (
                            <div className="w-4"></div>
                        )}
                        <span className="ml-2 font-medium">{item.name}</span>
                        {item.children && item.children.length > 0 && (
                            <span className="ml-2 text-xs text-gray-500">({item.children.length})</span>
                        )}
                    </div>

                    <div className="flex items-center">
                        <button className="p-1 mr-1 text-gray-500 hover:bg-gray-100 rounded-md">
                            <Tag size={16} />
                        </button>
                        <button className="p-1 mr-1 text-gray-500 hover:bg-gray-100 rounded-md">
                            <Plus size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-md">
                            <Move size={16} />
                        </button>
                    </div>
                </div>

                {item.expanded && item.children && item.children.length > 0 && (
                    <div>
                        {item.children.map(child => renderCategoryItem(child, level + 1))}
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
        setIsTrashHover(false);
        if (draggedItem) {
            // В реално приложение - тук би имало логика за изтриване
            alert(`Категорията "${draggedItem.name}" беше изтрита!`);
            setDraggedItem(null);
        }
    };

    return (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Управление на категории</h2>
                <div className="flex">
                    <button className="p-2 mr-2 bg-gray-100 rounded-md hover:bg-gray-200">
                        <Plus size={18} />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
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
                    placeholder="Търсене на категории..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">Влачете елементите, за да ги преместите</span>
                    <Move size={14} className="text-gray-500" />
                </div>

                {/* Кошче за отпадъци */}
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
                        stroke={isTrashHover ? "#e74c3c" : "currentColor"}
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
                    <span className={`ml-2 ${isTrashHover ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            Изтрий категория
          </span>
                </div>
            </div>

            <div className="border border-gray-200 rounded-md p-2">
                {categories.map(category => renderCategoryItem(category))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>* Влачете категориите до кошчето, за да ги изтриете, или върху други категории, за да ги преместите</p>
            </div>
        </div>
    );
};

export default CategorySystem;