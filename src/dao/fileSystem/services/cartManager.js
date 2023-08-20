import fs from "fs";
import Cart from "../models/cart.js";

import { dirname } from "../../../path.js";
import ProductManager from "./productManager.js";

class CartManager {
    constructor() {
        this.carts = [];
        this.path = `${dirname}/dao/fileSystem/cart.json`;
        this.productManager = new ProductManager();

        if(fs.existsSync(this.path)) {
            let info = fs.readFileSync(this.path, { encoding: 'utf-8' });
            if(info) {
                this.carts = JSON.parse(info);
                Cart.increments = this.carts.at(-1).id;
            }
        }
    }

    async addCart() {
        const cart = new Cart();
        this.carts.push(cart);
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2, "\t"));
    }

    async addProductToCart(idCart, idProduct) {
        let index = this.carts.findIndex(c => c.id == idCart);
        if(index == -1) {
            throw new Error(`No existe un carrito con el id ${id}`);
        }

        try {
            const product = await this.productManager.getProductById(idProduct);
        } catch(err) {
            throw new Error(`No existe un producto con el id ${idProduct}`);
        }
        
        let indexProduct = this.carts[index].products.findIndex(p => p.idProduct == idProduct);
        if(indexProduct == -1) {
            this.carts[index].products.push({
                product: Number(idProduct),
                quantity: 1
            });
        } else {
            this.carts[index].products[indexProduct]["quantity"]++;
        }

        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2, "\t"));
    }

    async getCarts() {
        return this.carts;
    }

    async getCartById(id) {
        let cart = this.carts.find(c => c.id == id);
        if(!cart) {
            throw new Error(`No existe un carrito con el id ${id}`);
        }
        cart.products = cart.products.map(({ product, quantity}) => {
            return {
                product: this.productManager.getProductByIdSync(product),
                quantity
            }
        });
        return cart;
    }
}

export default CartManager;