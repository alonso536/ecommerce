import User from "../dao/db/models/user.js";

export const noAuth = async (req, res, next) => {
    if(req.cookies["token"]) {
        const user = req.user;

        return res.render("profile", {
            title: "Perfil",
            user
        });
    }

    next();
}