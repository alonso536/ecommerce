// Descomentar para usar fileSystem
// import CartManager from "../dao/fileSystem/services/cartManager.js";

// Descomentar para usar base de datos
import CartManager from "../dao/db/services/cartManager.js";
import TicketManager from "../dao/db/services/ticketManager.js";

const cartManager = new CartManager();
const ticketManager = new TicketManager();

export const index = async (req, res) => {
    const carts = await cartManager.getCarts();

    return res.status(200).json({
        carts,
    });
}

export const store = async (req, res) => {
    try {
        await cartManager.addCart();

        return res.status(201).json({
            msg: "Carrito creado con exito",
        });
    } catch (err) {
        msg: err.toString();
    }
}

export const show = async (req, res) => {
    const { cid } = req.params;

    try {
        let cart = await cartManager.getCartById(cid);

        return res.status(200).json({
            cart,
        });
    } catch (error) {
        return res.status(404).json({
            msg: error.toString(),
        });
    }
}

export const add = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cartManager.addProductToCart(cid, pid);

        return res.status(201).json({
            msg: "Producto agregado al carrito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const remove = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cartManager.removeProductToCart(cid, pid);

        return res.status(201).json({
            msg: "Producto eliminado del carrito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const update = async (req, res) => {
    const { cid } = req.params;
    const { products = [] } = req.body;

    try {
        await cartManager.updateCart(cid, products);

        return res.status(201).json({
            msg: "Carrito actualizado con exito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const edit = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        await cartManager.updateProductToCart(cid, pid, quantity);

        return res.status(201).json({
            msg: "Cantidad del producto actualizada con exito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const destroy = async (req, res) => {
    const { cid } = req.params;

    try {
        await cartManager.clearCart(cid);

        return res.status(201).json({
            msg: "Carrito limpiado con exito",
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.toString(),
        });
    }
}

export const purchase = async (req, res) => {
    const { cid } = req.params;
    const { id } = req.user;

    try {
        const cart = await cartManager.getCartById(cid);
        const amount = cartManager.calculateTotal(cart);
        const ticket = await ticketManager.addTicket(id, amount, cart.products);

        await cartManager.reduceStock(cart);
        await cartManager.clearCart(cid);

        return res.status(201).json({
            ticket
        });

    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        });
    }
}