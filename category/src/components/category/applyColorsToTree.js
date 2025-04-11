const applyColorsToTree = (items) => {
    const colors = [
        '#3498db',
        '#2ecc71',
        '#9b59b6',
        '#f39c12',
        '#1abc9c',
        '#34495e',
    ];

    const applyColorToItemAndChildren = (item, color) => {
        const itemWithColor = {
            ...item,
            color: color
        };

        if (item.children && item.children.length > 0) {
            itemWithColor.children = item.children.map(child =>
                applyColorToItemAndChildren(child, color)
            );
        }

        return itemWithColor;
    };

    return items.map((item, index) => {
        const color = colors[index % colors.length];
        return applyColorToItemAndChildren(item, color);
    });
};

export default  applyColorsToTree;
