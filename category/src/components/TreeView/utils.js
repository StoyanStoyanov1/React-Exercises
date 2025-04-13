export const getTextColor = (bgColor) => {
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

export const findItem = (items, id) => {
    if (!items) return null;

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

export const countAllDescendants = (item) => {
    if (!item.children || item.children.length === 0) {
        return 0;
    }

    let count = item.children.length;

    for (const child of item.children) {
        count += countAllDescendants(child);
    }

    return count;
};

export const isDescendantOf = (item, potentialParentId) => {
    if (!item || !item.children) return false;

    for (const child of item.children) {
        if (child.id === potentialParentId) {
            return true;
        }

        if (child.children && child.children.length > 0) {
            if (isDescendantOf(child, potentialParentId)) {
                return true;
            }
        }
    }

    return false;
};

export const cloneTreeWithoutItem = (items, id) => {
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

export const updateExpandedState = (items, id) => {
    return items.map(item => {
        if (item.id === id) {
            return { ...item, expanded: !item.expanded };
        } else if (item.children && item.children.length > 0) {
            return {
                ...item,
                children: updateExpandedState(item.children, id)
            };
        }
        return item;
    });
};

export const filterTreeBySearchTerm = (items, searchTerm) => {
    if (!searchTerm.trim()) return items;

    const containsMatch = (item, term) => {
        if (item.name.toLowerCase().includes(term.toLowerCase())) {
            return true;
        }

        if (item.children && item.children.length > 0) {
            return item.children.some(child => containsMatch(child, term));
        }

        return false;
    };

    return items.reduce((filtered, item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasMatchingChildren = item.children &&
            item.children.length > 0 &&
            item.children.some(child => containsMatch(child, searchTerm));

        if (matchesSearch) {
            return [...filtered, {
                ...item
            }];
        } else if (hasMatchingChildren) {
            const filteredChildren = filterTreeBySearchTerm(item.children, searchTerm);

            return [...filtered, {
                ...item,
                expanded: item.expanded,
                children: filteredChildren
            }];
        }

        return filtered;
    }, []);
};

export const updateItemColors = (item, newColor) => {
    item.color = newColor;
    if (item.children && item.children.length > 0) {
        item.children.forEach(child => updateItemColors(child, newColor));
    }
};

export const getColorFromPalette = (index) => {
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
    return colors[index % colors.length];
};