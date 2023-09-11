import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validateFields.js";
import passport from "passport";

const router = Router();

router.post("/register", [
    check("firstname", "El nombre es obligatorio").notEmpty(),
    check("lastname", "El apellido es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").notEmpty(),
    check("email", "El email debe estar en un formato correcto").isEmail(),
    check("password", "La contraseña en obligatoria").notEmpty(),
    check("age", "La edad es obligatoria").notEmpty(),
    check("age", "La edad debe ser un número").isNumeric(),
    validateFields,
    passport.authenticate("register")
] ,async (req, res) => {

    return res.status(201).json({
        msg: "Usuario creado"
    });
});

router.post("/login", passport.authenticate("login"), async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).json({
                msg: "Datos incorrectos"
            });
        }    
        const { _id, firstname, lastname, email, age } = req.user;
    
        req.session.user = {
            id: _id,
            name: `${firstname} ${lastname}`,
            email,
            age,
            role: "ROLE_USER"
        }
    
        return res.status(200).json({
            id: _id
        });
    } catch(error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error. Hable con el administrador"
        });
    }    
});

router.post("/logout", async (req, res) => {
    req.session.destroy(error => {
        if(error) {
            return res.status(500).json({
                status: "error",
                msg: "Ha ocurrido un error. Hable con el administrador"
            });
        }
        return res.status(200).json({
            status: "success",
            msg: "Logout OK"
        });
    });
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    const { _id, firstname, lastname, email, age } = req.user;

    req.session.user = {
        id: _id,
        name: `${firstname} ${lastname}`,
        email,
        age,
        role: "ROLE_USER"
    };
    res.redirect("/products");
});

export default router;