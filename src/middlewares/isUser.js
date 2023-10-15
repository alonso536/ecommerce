export const isUser = (req, res, next) => {
    const { role } = req.user;
    if(role != "ROLE_USER") {
        return res.status(403).json({
            msg: "Unauthorized"
        });
    }
    next();
}