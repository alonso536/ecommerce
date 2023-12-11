export const validateFile = (validExtentions = ["jpg", "jpeg", "png"]) => {
    return (req, res, next) => {
        if(!req.files) {
            return res.status(400).json({
                msg: "No se ha subido ningún archivo"
            });
        }

        const { file } = req.files;
        const extention = file.name.split(".").at(-1);

        if(!validExtentions.includes(extention)) {
            return res.status(400).json({
                msg: `La extensión ${extention} no es válida`
            });
        }
    
        next();
    }
}