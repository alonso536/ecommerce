import UserManager from "../dao/db/services/userManager.js";
import { generateJWT } from "../helpers/generateJwt.js";

const userManager = new UserManager();

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

export const logout = async (req, res) => {
    res.clearCookie("token").send({
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