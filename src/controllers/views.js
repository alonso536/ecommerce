import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";
import UserManager from "../dao/db/services/userManager.js";
import TicketManager from "../dao/db/services/ticketManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const ticketManager = new TicketManager();
const userManager = new UserManager();

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
    const user = userManager.getUser(req.user);

    res.render("chat", {
        title: "Sala de chat",
        user
    });
}

export const products = async (req, res) => {
    const { limit = 6, page = 1, sort = null, query = null } = req.query;
    const products = await productManager.getProducts(limit, page, sort, query);

    const user = userManager.getUser(req.user);

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
    const user = userManager.getUser(req.user);

    res.render("profile", {
        title: "Perfil",
        user,
    });
}

export const addProduct = async (req, res) => {
    const user = userManager.getUser(req.user);

    res.render("add", {
        title: "Agregar producto",
        user
    });
}

export const editProduct = async (req, res) => {
    const { id } = req.query;

    try {
        const user = userManager.getUser(req.user);
        const product = await productManager.getProductById(id);

        return res.render("add", {
            title: "Editar producto",
            user,
            product
        });
    } catch(err) {
        return res.render("error", {
            title: err.toString()
        });
    }
}

export const cart = async (req, res) => {
    try {
        const user = req.user;
        const cart = await cartManager.getCartById(user.cart);
        const total = cartManager.calculateTotal(cart);

        return res.render("carts", {
            title: "Productos en el carrito",
            user,
            cart,
            total
        });
    } catch (error) {
        res.render("error", {
            title: error.toString(),
        });
    }
}

export const ticket = async (req, res) => {
    const { tid } = req.query;

    try {
        const user = req.user;
        const ticket = await ticketManager.getTicketById(tid);

        return res.render("ticket", {
            title: "Ticket",
            ticket,
            user,
        });
    } catch (error) {
        res.render("error", {
            title: error.toString(),
        });
    }
}