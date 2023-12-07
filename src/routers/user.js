import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import * as controller from "../controllers/user.js";
import { validateFields } from "../middlewares/validateFields.js";
import { permitRoles } from "../middlewares/permitRoles.js";
import { uploads } from "../middlewares/multer.js";

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

router.post("/:id/profile", [
    passport.authenticate("jwt", { session: false }),
    uploads.single("file"),
    validateFields,
], controller.uploadAvatar);

router.get("/:id/profile", [
    passport.authenticate("jwt", { session: false }),
    validateFields,
], controller.avatar);

router.post("/:id/documents", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    check("id", "Debe ser un id válido").isMongoId(),
    uploads.fields([ 
        { name: "identify", maxCount: 1 }, 
        { name: "domicile", maxCount: 1 }, 
        { name: "account_status", maxCount: 1 }
    ]),
    validateFields
], controller.documents);

export default router;