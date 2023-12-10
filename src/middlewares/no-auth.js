export const noAuth = async (req, res, next) => {
    if(req.cookies["token"]) {
        return res.status(403).send("Fobidden");
    }

    next();
}