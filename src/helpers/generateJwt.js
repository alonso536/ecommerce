import jwt from "jsonwebtoken";

export const generateJWT = ({ _id, firstname, lastname, email, age, cart, role }) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: _id,
            name: `${firstname} ${lastname}`,
            email,
            age,
            cart,
            role
        };

        jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h"
        }, (err, token) => {
            if(err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}