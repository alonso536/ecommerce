import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { dirname } from "../path.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${dirname}/uploads`);
    },
    filename: (req, file, cb) => {
        let extention = file.originalname.split(".").at(-1);
        cb(null, uuidv4() + "." + extention);
    }
});

export const uploads = multer({ storage });