import { getColorFromPalette, updateItemColors } from './utils';

const applyColorsToTree = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item, index) => {
        const color = item.color || getColorFromPalette(index);
        const newItem = { ...item, color };

        if (item.children && item.children.length > 0) {
            newItem.children = item.children.map(child => {
                const childCopy = { ...child, color };

                if (child.children && child.children.length > 0) {
                    updateItemColors(childCopy, color);
                }

                return childCopy;
            });
        }

        return newItem;
    });
};

export default applyColorsToTree;