import Cart from "../models/cart.js";
import Product from "../models/product.js";

class CartManager {
    async addCart() {
        try {
            return await Cart.create({});
        } catch (err) {
            throw new Error("Error al insertar el carrito");
        }
    }

    async addProductToCart(idCart, idProduct) {
        const product = await Product.findById(idProduct);
        if (!product || !product.status) {
            throw new Error(`No existe un producto con el id ${idProduct}`);
        }

        const cart = await Cart.findById(idCart);
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }

        const item = cart.products.find((i) => i.product.equals(idProduct));

        if (!item) {
            cart.products.push({ product: idProduct });
        } else {
            const index = cart.products.findIndex(
                (i) => i.product == idProduct
            );
            cart.products[index].quantity++;
        }
        await cart.save();
    }

    async getCarts() {
        try {
            return await Cart.find().select("uid");
        } catch (err) {
            throw new Error("Error al buscar los carritos");
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id)
                .populate({
                    path: "products.product",
                    select: [
                        "title",
                        "description",
                        "price",
                        "stock",
                        "category",
                    ],
                })
                .lean();
            if (!cart) {
                throw new Error(`No existe un carrito con el id ${id}`);
            }
            return cart;
        } catch (err) {
            throw new Error(`No existe un carrito con el id ${id}`);
        }
    }

    async removeProductToCart(idCart, idProduct) {
        const product = await Product.findById(idProduct);
        if (!product || !product.status) {
            throw new Error(`No existe un producto con el id ${idProduct}`);
        }

        const cart = await Cart.findById(idCart);
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }

        const item = cart.products.find((i) => i.product.equals(idProduct));

        if (!item) {
            throw new Error(
                `No existe un producto con el id ${idProduct} dentro del carrito con id ${idCart}`
            );
        } else {
            cart.products = cart.products.filter(
                (p) => !p.product.equals(idProduct)
            );
        }
        await cart.save();
    }

    async updateCart(idCart, products) {
        const cart = await Cart.findById(idCart);
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }

        cart.products = products.map((product) => {
            return {
                product,
                quantity: 1,
            };
        });

        try {
            await cart.save();
        } catch (error) {
            throw new Error(
                `No se pudo actualizar el carrito. Los productos no son válidos`
            );
        }
    }

    async updateProductToCart(idCart, idProduct, quantity) {
        const product = await Product.findById(idProduct);
        if (!product || !product.status) {
            throw new Error(`No existe un producto con el id ${idProduct}`);
        }

        const cart = await Cart.findById(idCart);
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }

        const item = cart.products.find((i) => i.product.equals(idProduct));

        if (!item) {
            throw new Error(
                `No existe un producto con el id ${idProduct} dentro del carrito con id ${idCart}`
            );
        } else {
            const index = cart.products.findIndex(
                (i) => i.product == idProduct
            );
            cart.products[index].quantity = quantity;
        }
        await cart.save();
    }

    async clearCart(idCart) {
        const cart = await Cart.findById(idCart);
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${idCart}`);
        }

        cart.products = [];

        await cart.save();
    }

    async reduceStock(cart) {
        cart.products.forEach(async(p) => {
            const product = await Product.findById(p.product._id);
            product.stock -= p.quantity;

            if(product.stock === 0) {
                product.status = false;
            }

            await product.save();
        });
    }

    calculateTotal(cart) {
        let total = 0;
        cart.products.forEach(p => {
            total += p.quantity * p.product.price;
        });
        
        return total;
    }

    printProducts(products) {
        let result = "";

        products.forEach(({ product, quantity }) => {
            result += `
                <tr>
                    <td>${product.title}</td>
                    <td>${product.price}</td>
                    <td>${quantity}</td>
                </tr>
            `;
        });

        return result;
    }
}

export default CartManager;
