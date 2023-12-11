import MailManager from "../dao/db/services/mailManager.js";
import UserManager from "../dao/db/services/userManager.js";
import { generateJWT } from "../helpers/generateJwt.js";

const userManager = new UserManager();
const mailManager = new MailManager();

export const register = async (req, res) => {
    return res.status(201).json({
        msg: "Usuario creado"
    });
}

export const login = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400).json({
                msg: "Datos incorrectos"
            });
        }    
        const token = await generateJWT(req.user);
        await userManager.lastConnection(req.user.id);
    
        return res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({
            token
        });
    } catch(error) {
        return res.status(500).json({
            msg: "Ha ocurrido un error. Hable con el administrador"
        });
    }   
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    let user;

    try {
        user = await userManager.findByEmail(email);
        if(!user) {
            return res.status(400).json({
                msg: "No se pudo encontrar al usuario"
            });
        }
    } catch(error) {
        return res.status(400).json({
            msg: "No se pudo encontrar al usuario"
        });
    }

    const body = { 
        to: email, 
        subject: "Recuperación de contraseña", 
        body: `${process.env.ENDPOINT}/password-recovery" target="_blank">Recuperar contraseña</a>`
    };

    const result = await mailManager.sendMail(body);

    return res.cookie("passwordRecovery", email, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).send({
        cookie: "Esta cookie es para recuperar la contraseña, y expira en una hora",
        result
    });
}

export const passwordRecovery = async (req, res) => {
    const { email } = req.params;
    const { password, password2 } = req.body;

    if(password != password2) {
        return res.status(400).json({
            errors: [{
                type: "field",
                msg: "Las contraseñas deben coincidir",
                value: password2,
                path: "password2",
                location: "body"
            }]
        });
    }

    try {
        await userManager.passwordRecovery(email, password);

        return res.clearCookie("passwordRecovery").send({
            status: "success",
            msg: "Contraseña actualizada exitosamente"
        });
    } catch(error) {
        return res.status(400).json({
            error: error.toString()
        });
    }
}

export const logout = async (req, res) => {
    await userManager.lastConnection(req.user.id);

    return res.clearCookie("token").send({
        status: "success",
        msg: "Logout OK"
    });
}

export const github = async (req, res) => {}

export const githubcallback = async (req, res) => {
    const token = await generateJWT(req.user);
    
    return res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).redirect("/products");
}

export const current = (req, res) => {
    const user = userManager.getUser(req.user);
    return res.status(200).json({
        user
    });
}