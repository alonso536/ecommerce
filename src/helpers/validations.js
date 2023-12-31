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
