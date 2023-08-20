class Product {
    static increments = 0;

    constructor(title, description, code, price, stock, category, status = true) {
        this.id = ++Product.increments;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = [];
    }
}

export default Product;
