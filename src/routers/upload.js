import { Router } from "express";
import { check } from "express-validator";
import passport from "passport";

import * as controller from "../controllers/upload.js";
import { validateFields } from "../middlewares/validateFields.js";
import { validateFile } from "../middlewares/validateFile.js";
import { allowCollections } from "../helpers/validations.js";
import { permitRoles } from "../middlewares/permitRoles.js";

const router = Router();

router.post("/:collection/:id", [
    passport.authenticate("jwt", { session: false }),
    validateFile(),
    check("id", "Debe ser un id de mongo").isMongoId(),
    check("collection").custom((c) => allowCollections(c, ["products", "users"])),
    validateFields
], controller.store);

export default router;