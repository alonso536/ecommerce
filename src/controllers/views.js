import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

export const register = (req, res) => {
    res.render("register", {
        title: "Registro de usuarios"
    });
}

export const login = (req, res) => {
    res.render("login", {
        title: "Iniciar sesión",
    });
}

export const chat = (req, res) => {
    res.render("chat", {
        title: "Sala de chat",
    });
}

export const products = async (req, res) => {
    const { limit = 6, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);

    const user = req.user;

    if (page > products.totalPages) {
        res.render("error", {
            title: "No existen productos en esta página",
            user
        });
    } else {
        res.render("products", {
            title: "Lista de productos",
            products,
            user
        });
    }
}

export const profile = async (req, res) => {
    const user = req.user;

    res.render("profile", {
        title: "Perfil",
        user,
    });
}

export const cart = async (req, res) => {
    try {
        const user = req.user;

        const cart = await cartManager.getCartById(user.cart);
        res.render("carts", {
            title: "Productos en el carrito",
            user,
            cart,
        });
    } catch (error) {
        res.render("error", {
            title: error.toString(),
        });
    }
}