export const auth = (req, res, next) => {
    if(!req.session.user) {
        return res.status(401).render("login", {
            title: "Iniciar sesión"
        });
    }

    next();
}