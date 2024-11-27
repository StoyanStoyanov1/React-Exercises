import isValidDate from './isValidDate';

function customFilterLogic (data, order="asc") {
    const entries = Object.entries(data);
    const numberRegex = /^\d+(\.\d+)?$/;
     
    const sortedEntries = entries.map(([key, values]) => {
        if (typeof values[0] === "number" || numberRegex.test(values[0])) {
          values.sort((a, b) => order === 'asc' ? a - b : b - a);
        } else if (typeof values[0] === "string") {
            if (isValidDate(values[0])) {
                values.map(date => new Date(date));
            }
          values.sort((a, b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)) 
        }

        return [key, values];
    });

    const sortedObject = Object.fromEntries(sortedEntries);

    console.log(sortedObject);

  };

export default customFilterLogic;