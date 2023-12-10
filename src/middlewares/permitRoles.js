export const permitRoles = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if(!roles.includes(role)) {
            return res.status(403).send("Forbidden");
        }
        next();
    }
}