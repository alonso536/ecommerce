class Cart {
    static increments = 0;

    constructor() {
        this.id = ++Cart.increments;
        this.products = [];
    }
}

export default Cart;