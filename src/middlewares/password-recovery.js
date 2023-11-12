export const passwordRecovery = async (req, res, next) => {
    if(!req.cookies["passwordRecovery"]) {

        return res.render("forgot-password", {
            title: "Recuperar contraseña"
        });
    }

    next();
}