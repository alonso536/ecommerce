import { dirname } from "../../../path.js";
import UserDto from "../dto/user.js";
import Cart from "../models/cart.js";
import Message from "../models/message.js";
import Product from "../models/product.js";
import Ticket from "../models/ticket.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";

import fs from "fs";
import MailManager from "./mailManager.js";

class UserManager {

    mailManager;

    constructor() {
        this.mailManager = new MailManager();
    }

    async findAll() {
        const users = await User.find({ role: { $ne: "ROLE_ADMIN" } });
        return users.map(({ _id, firstname, lastname, email, age, role, cart }) => new UserDto(_id, `${firstname} ${lastname}`, email, age, role, cart));
    }

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

    async updateUser(id, user) {
        try {
            return await User.findByIdAndUpdate(id, user, { new: true });
        } catch(error) {
            throw new Error(`No se pudo encontrar el usuario`);
        }
    }

    async deleteUser(id) {
        try {
            const { _id, email, role, cart, avatar, documents } = await User.findByIdAndDelete(id, { new: true });
            
            if(role == "ROLE_PREMIUM") {
                await Product.updateMany({ owner: _id }, { status: false });
            }

            if(avatar && avatar != "") {
                fs.unlinkSync(`${dirname}/uploads/profiles/${avatar}`);
            }

            if(documents && documents.length > 0) {
                documents.forEach(({ reference }) => {
                    fs.unlinkSync(`${dirname}/uploads/documents/${reference}`);
                });
            }

            await Cart.findByIdAndDelete(cart);
            await Ticket.deleteMany({ purchaser: _id });
            await Message.deleteMany({ user: _id });

            const body = "Su cuenta ha sido eliminada por inactividad";
            await this.mailManager.sendMail({ to: email, subject: "Cuenta eliminada", body });

        } catch(error) {
            throw new Error(`No se pudo encontrar el usuario`);
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

    async deleteAll() {
        const currentDate = new Date();
        const twoDaysAgoDate = new Date();

        twoDaysAgoDate.setMinutes(currentDate.getDate() - 2);

        try {
            const users = await User.find({ last_connection: { $lt: twoDaysAgoDate }, role: { $ne: "ROLE_ADMIN" } });
            
            users.forEach(async ({ _id }) => {
                await this.deleteUser(_id);
            });

        } catch(error) {
            throw new Error(error.toString());
        }
    }
}

export default UserManager;