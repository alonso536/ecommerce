import { Router } from "express";
import { check } from "express-validator";

import * as controller from "../controllers/mail.js";
import { validateFields } from "../middlewares/validateFields.js";


const router = Router();

router.get("/", [
    check("to", "El destinatario es obligatorio").notEmpty(),
    check("to", "El destinatario debe ser un email").isEmail(),
    check("body", "El mensaje es obligatorio").notEmpty(),
    validateFields
], controller.mail);

export default router;
