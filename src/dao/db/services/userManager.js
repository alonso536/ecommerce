import UserDto from "../dto/user.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";

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
            throw new Error(`No se pudo encontrar e usuario`);
        }
    }

    async findById(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch(error) {
            throw new Error(`No se pudo encontrar e usuario`);
        }
    }

    async setUserPremium(id) {
        try {
            const user = await this.findById(id);

            console.log(user);
            if(!user) {
                throw new Error(`No existe un usuario con id ${id}`);
            }

            if(user.role == "ROLE_PREMIUM") {
                await Product.deleteMany({ owner: idOwner });
                user.role = "ROLE_USER";
            } else {
                user.role = "ROLE_PREMIUM"
            }

            await user.save();
            return user;
        } catch(error) {
            throw new Error(`No se pudo cambiar el role del usuario`);
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
}

export default UserManager;