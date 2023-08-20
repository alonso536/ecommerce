import Cart from "../models/cart.js";
import Product from "../models/product.js";

class CartManager {
    async addCart() {
        try {
            await Cart.create({});
        } catch(err) {
            throw new Error("Error al insertar el carrito");
        }
    }

    async addProductToCart(idCart, idProduct) {
        const product = await Product.findById(idProduct);
        if(!product || !product.status) {
            throw new Error(`No existe un producto con el id ${idProduct}`);
        }

        const cart = await Cart.findById(idCart);
        if(!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }
        
        const item = cart.products.find(i => i.product.equals(idProduct));
        
        if(!item) {
            cart.products.push({ product: idProduct });     
        } else {
            const index = cart.products.findIndex(i => i.product == idProduct);
            cart.products[index].quantity++;
        }
        await cart.save();
    }

    async getCarts() {
        try {
            return await Cart.find().populate("items");
        } catch(err) {
            throw new Error("Error al buscar los carritos");
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate({ path: "products.product", select: ["title", "description", "price", "stock", "category"] });
            if(!cart) {
                throw new Error(`No existe un carrito con el id ${id}`);
            }
            return cart;
        } catch(err) {
            throw new Error(`No existe un carrito con el id ${id}`);
        }
    }
}

export default CartManager;