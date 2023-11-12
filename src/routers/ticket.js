import { Router } from "express";
import passport from "passport";

import { validateFields } from "../middlewares/validateFields.js";
import * as controller from "../controllers/ticket.js";
import { permitRoles } from "../middlewares/permitRoles.js";

const router = Router();

router.get("/", [
    passport.authenticate("jwt", { session: false }),
    permitRoles(["ROLE_USER", "ROLE_PREMIUM"]),
    validateFields
], controller.index);

export default router;
