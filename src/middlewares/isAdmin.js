export const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if(role != "ROLE_ADMIN") {
        return res.status(403).json({
            msg: "Unauthorized"
        });
    }
    next();
}