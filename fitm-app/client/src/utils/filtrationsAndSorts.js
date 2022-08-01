export const filterByRangeAndSearch = (
  collection,
  objectAttr,
  sliderValue,
  search
) => {
  return collection.filter((item) => {
    // Object.keys(item) => gets all properties of a item and turns them into array
    // .some() => if any of the keys array match the condition in the some callback return true, if not false
    // condition => checks if any of the values of the item properties match the search criteria
    return Object.keys(item).some((key) => {
      return (
        ("" + item[key]).toLowerCase().includes(search.toLowerCase()) &&
        item[objectAttr] <= sliderValue
      );
    });
  });
};

export const filterBySingle = (collection, search, column) => {
  return collection.filter((item) => {
    return item[column].toLowerCase().includes(search.toLowerCase());
  });
};

// export const filterByMultiple = (collection, search, columns) => {
//   return collection.filter(({columns}) => {
//     return [columns].some((val) => {
//       return val.toLowerCase().includes(search.toLowerCase());
//     });
//   });
// };

export const filterByMultiple = (collection, search, columns) => {
  return collection.filter((item) => {
    return [item.name].some((val) => {
      return val.toLowerCase().includes(search.toLowerCase());
    });
  });
};

export const sortByNumberDesc = (collection, objectAttr) => {
  collection.sort(
    (a, b) => parseFloat(b[objectAttr]) - parseFloat(a[objectAttr])
  );
};
export const sortByNumberAsc = (collection, objectAttr) => {
  collection.sort(
    (a, b) => parseFloat(a[objectAttr]) - parseFloat(b[objectAttr])
  );
};
