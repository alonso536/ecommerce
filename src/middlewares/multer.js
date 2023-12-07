import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { dirname } from "../path.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const route = req.route.path.split("/").at(-1);

        switch(route) {
            case "img":
                cb(null, `${dirname}/uploads/products`);
                break;
            case "profile":
                cb(null, `${dirname}/uploads/profiles`);
                break;
            case "documents":
                cb(null, `${dirname}/uploads/documents`);
                break;
        }
    },
    filename: (req, file, cb) => {
        let extention = file.originalname.split(".").at(-1);
        cb(null, `${uuidv4()}.${extention}`);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.fieldname === "file") {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

}

export const uploads = multer({ storage, fileFilter });