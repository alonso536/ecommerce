import { dirname } from "../../../path.js";
import UserDto from "../dto/user.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";

import fs from "fs";

class UserManager {
    getUser(user) {
        const { id, name, email, age, role, cart } = user;
        return new UserDto(id, name, email, age, role, cart);
    }

    async findByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch(error) {
            throw new Error(`No se pudo encontrar el usuario`);
        }
    }

    async findById(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch(error) {
            throw new Error(`No se pudo encontrar el usuario`);
        }
    }

    async setUserPremium(id) {
        try {
            const user = await this.findById(id);

            if(!user) {
                throw new Error(`No existe un usuario con id ${id}`);
            }

            if(user.role == "ROLE_PREMIUM") {
                await Product.updateMany({ owner: id }, { $set: { status: false } });
                user.role = "ROLE_USER";
            } else {
                if(!user.documents || user.documents.length === 0) {
                    throw new Error("El usuario no ha subido la documentación");
                }
                user.role = "ROLE_PREMIUM"
            }

            await user.save();
            return user;
        } catch(error) {
            throw new Error(error.toString().split(": ").at(-1));
        }
    }

    async deleteUser(id) {
        try {
            await User.findByIdAndDelete(id, { new: true });
        } catch(error) {
            throw new Error(`No se pudo encontrar e usuario`);
        }
    }

    async passwordRecovery(email, password) {
        try {
            const user = await User.findOne({ email });

            if(bcryptjs.compareSync(password, user.password)) {
                throw new Error("La contraseña debe ser distinta de la anterior");
            }

            user.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync());
            await user.save();

        } catch(error) {
            throw new Error(error.toString());
        }
    }

    async uploadDocuments(files, id) {
        const { identify, domicile, account_status } = files;
        try {
            const user = await User.findById(id);
            const documents = [
                { name: "identify", reference: identify[0].filename },
                { name: "domicile", reference: domicile[0].filename },
                { name: "account_status", reference: account_status[0].filename }
            ];

            if(user.documents.length > 0) {
                user.documents.forEach(({ reference }) => {
                    fs.unlinkSync(`${dirname}/uploads/documents/${reference}`);
                });
            }

            user.documents = documents;
            await user.save();
        } catch(error) {
            this.deleteDocuments(files);
            throw new Error("Ha ocurrido un error. Hable con el administrador");
        }
    }

    async lastConnection(id) {
        try {
            const user = await User.findById(id);
            user.last_connection = new Date();

            await user.save();
        } catch(error) {
            throw new Error("Ha ocurrido un error. Hable con el administrador");
        }
    }

    deleteDocuments(files) {
        const { identify, domicile, account_status } = files;

        if(identify) {
            fs.unlinkSync(identify[0].path)
        }

        if(domicile) {
            fs.unlinkSync(domicile[0].path)
        }

        if(account_status) {
            fs.unlinkSync(account_status[0].path)
        }
    }

    async uploadAvatar(file, id, allowExtentions = ["jpg", "jpeg", "png"]) {
        const user = await User.findById(id);
        if (!user) {
            fs.unlinkSync(`${dirname}/uploads/profiles/${file.filename}`);
            throw new Error(`No existe un usuario con el id ${id}`);
        }

        if(!!user.avatar && user.avatar !== "") {
            fs.unlinkSync(`${dirname}/uploads/profiles/${user.avatar}`);
        }

        let hasUpload = true;

        const extention = file.filename.split(".").at(-1);
        if(!allowExtentions.includes(extention)) {
            hasUpload = false;
            fs.unlinkSync(`${dirname}/uploads/profiles/${file.filename}`);
        } else {
            user.avatar = file.filename;
        }

        await user.save();

        if (!hasUpload) {
            throw new Error("Las extensiones permitidas son solo jpg, jpeg, png");
        }
    }

    async showAvatar(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error(`No existe un usuario con el id ${id}`);
        }

        if (!user.avatar || user.avatar === "") {
            return `${dirname}/public/assets/no-image.png`;
        }

        const filename = user.avatar;
        const pathImg = `${dirname}/uploads/profiles/${filename}`;
        if (!fs.existsSync(pathImg)) {
            user.avatar = "";
            await user.save();
            return `${dirname}/public/assets/no-image.png`;
        }

        return pathImg;
    }
}

export default UserManager;