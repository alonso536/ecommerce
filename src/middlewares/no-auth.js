export const noAuth = (req, res, next) => {
    if(req.session.user) {
        const { user } = req.session;
        return res.render("profile", {
            title: "Perfil",
            user
        });
    }

    next();
}