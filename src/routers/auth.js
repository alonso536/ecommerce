import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validateFields.js";
import passport from "passport";
import * as controller from "../controllers/auth.js";

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
], controller.register);

router.post("/login", passport.authenticate("login"), controller.login);

router.post("/logout", controller.logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}), controller.githubcallback);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), controller.githubcallback);

router.get("/current", passport.authenticate("jwt", { session: false }), controller.current);

export default router;