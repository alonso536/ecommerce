import ProductManager from "../dao/db/services/productManager.js";
import CartManager from "../dao/db/services/cartManager.js";
import UserManager from "../dao/db/services/userManager.js";
import TicketManager from "../dao/db/services/ticketManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const ticketManager = new TicketManager();
const userManager = new UserManager();

const endpoint = process.env.ENDPOINT;

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

export const forgotPassword = (req, res) => {
    res.render("forgot-password", {
        title: "Recuperar contraseña"
    });
}

export const passwordRecovery = (req, res) => {
    const email = req.cookies["passwordRecovery"];

    res.render("password-recovery", {
        title: "Nueva contraseña",
        email
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
            user,
            endpoint
        });
    } else {
        res.render("products", {
            title: "Lista de productos",
            products,
            user,
            endpoint
        });
    }
}

export const profile = async (req, res) => {
    const user = userManager.getUser(req.user);

    res.render("profile", {
        title: "Perfil",
        user,
        endpoint
    });
}

export const uploadDocuments = async (req, res) => {
    const user = userManager.getUser(req.user);

    res.render("upload-documents", {
        title: "Subir documentos",
        subtitle: "Para volverse usuario premium debe subir los siguientes documentos",
        user
    })
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

export const users = async (req, res) => {
    try {
        const users = await userManager.findAll();
        const user = userManager.getUser(req.user);

        return res.render("users", {
            users,
            user
        });
    } catch(error) {
        res.render("error", {
            title: error.toString(),
        });
    }
}

export const editProfile = async (req, res) =>  {
    try {
        const { firstname, lastname } = await userManager.findById(req.user.id);
        const user = userManager.getUser(req.user);

        return res.render("edit-profile", {
            user,
            firstname,
            lastname,
            title: "Editar perfil"
        });
    } catch(error) {
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