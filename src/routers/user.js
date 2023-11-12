import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import * as controller from "../controllers/user.js";
import { validateFields } from "../middlewares/validateFields.js";
import { permitRoles } from "../middlewares/permitRoles.js";


const router = Router();

router.put("/:id", [
    passport.authenticate("jwt", { session: false })
    // check("id", "Debe ser un id válido").isMongoId(),
    // check("firstname", "El nombre es obligatorio").notEmpty(),
    // check("lastname", "El apellido es obligatorio").notEmpty(),
    // check("age", "La edad es obligatoria").notEmpty(),
    // check("age", "La edad debe ser un número").isNumeric(),
    // validateFields,
], controller.update);

router.patch("/premium/:id", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN"]),
    check("id", "Debe ser un id válido").isMongoId(),
    validateFields,
], controller.premium);

router.delete("/:id", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_ADMIN"]),
    check("id", "Debe ser un id válido").isMongoId(),
    validateFields,
], controller.destroy);

export default router;