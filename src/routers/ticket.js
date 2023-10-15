import { Router } from "express";
import passport from "passport";

import { validateFields } from "../middlewares/validateFields.js";
import * as controller from "../controllers/ticket.js";
import { isUser } from "../middlewares/isUser.js";

const router = Router();

router.get("/", [
    passport.authenticate("jwt", { session: false }),
    isUser,
    validateFields
], controller.index);

export default router;
