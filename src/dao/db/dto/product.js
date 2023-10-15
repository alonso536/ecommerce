class ProductDto {
    constructor({ _id, title, description, code, price, stock, category }) {
        this.id = _id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }
}

export default ProductDto;