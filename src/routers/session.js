import { Router } from "express";
import { check } from "express-validator";
import bcryptjs from "bcryptjs";

import User from "../dao/db/models/user.js";
import { validateFields } from "../middlewares/validateFields.js";

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
] ,async (req, res) => {
    const { firstname, lastname, email, password, age } = req.body;

    const user = new User({
        firstname,
        lastname,
        email,
        password: bcryptjs.hashSync(password, bcryptjs.genSaltSync()),
        age
    });

    await user.save();
    return res.status(201).json({
        user
    });

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.user = {
            firstname: "Admin",
            lastname: "Admin",
            email: "adminCoder@coder.com",
            age: "desconocida",
            role: "ADMIN_ROLE"
        }

        return res.status(200).json({
            id: "admin"
        });
    }

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: "Datos incorrectos"
            });
        }

        if(!bcryptjs.compareSync(password, user.password)) {
            return res.status(400).json({
                msg: "Datos incorrectos"
            });
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            age: user.age,
            role: "USER_ROLE"
        }

        return res.status(200).json({
            id: user.id
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

export default router;