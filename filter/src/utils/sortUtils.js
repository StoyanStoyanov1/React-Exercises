const baseComparators = {
    number: (a, b, order = 'asc') =>
        order === 'asc' ? a - b : b - a,

    string: (a, b, order = 'asc') =>
        order === 'asc'
            ? a.localeCompare(b)
            : b.localeCompare(a),

    date: (a, b, order = 'asc') =>
        order === 'asc' ? a - b : b - a,
};

const typeValidators = {
    isNumber: (value) =>
        typeof value === 'number' || !isNaN(Number(value)),

    isDate: (value) => {
        if (typeof value !== 'string') return false;
        const parts = value.split('.');
        if (parts.length !== 3) return false;

        const [day, month, year] = parts.map(Number);
        if (
            isNaN(day) || isNaN(month) || isNaN(year) ||
            day < 1 || day > 31 || month < 1 || month > 12
        ) {
            return false;
        }

        const parsedDate = new Date(year, month - 1, day);
        return (
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day
        );
    },
};

function detectDataType(value) {
    if (typeValidators.isNumber(value)) return 'number';
    if (typeValidators.isDate(value)) return 'date';
    return 'string';
}

function extractValues(jsonArray, key) {
    return jsonArray.map(item => item[key]);
}

function sortJsonArray(jsonArray, key, order = 'asc') {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        throw new Error('Array is empty!');
    }

    const values = extractValues(jsonArray, key);

    const dataType = detectDataType(values[0]);

    const comparator = baseComparators[dataType];

    if (!comparator) {
        throw new Error(`Unsupported data type for key "${key}": ${dataType}`);
    }

    const transformedArray = dataType === 'date'
        ? jsonArray.map(item => ({
            ...item,
            _sortValue: (() => {
                const [day, month, year] = item[key].split('.');
                return new Date(year, month - 1, day);
            })(),
        }))
        : jsonArray.map(item => ({
            ...item,
            _sortValue: item[key],
        }));

    const sortedArray = transformedArray.sort((a, b) =>
        comparator(a._sortValue, b._sortValue, order)
    );

    return sortedArray.map(({ _sortValue, ...rest }) => rest);
}

function filterByNumberRange(jsonArray, key, minValue = null, maxValue = null) {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        throw new Error('Array is empty!');
    }

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
        throw new Error('The minimum value cannot be greater than the maximum value.');
    }

    return jsonArray.filter(item => {
        const value = Number(item[key]);

        if (isNaN(value)) {
            return false;
        }

        return (
            (minValue === null || value >= minValue) &&
            (maxValue === null || value <= maxValue)
        );
    });
}

function filterBySearch (values, key, search) {

    return values.filter((item) =>
        String(item[key])
          .toLowerCase()
          .includes(search.toLowerCase())
      );
}

const sortUtils = {
    baseComparators,
    typeValidators,
    detectDataType,
    extractValues,
    sortJsonArray,
    filterByNumberRange,
    filterBySearch,
};

export default sortUtils;
