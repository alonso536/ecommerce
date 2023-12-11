export const isCategoryValid = async (category) => {
    const allowsCategories = [
        "Laptops",
        "Smartphones",
        "Tablets",
        "Smartwatches",
    ];
    if (!allowsCategories.includes(category)) {
        throw new Error(`La categoría ${category} no está permitida`);
    }

    return true;
};

export const allowCollections = (collection, collections) => {
    const include = collections.includes(collection);
    if(!include) {
        throw new Error(`La colección no es válida`);
    }

    return true;
}
