import MailManager from "../dao/db/services/mailManager.js";

const mailManager = new MailManager();

export const mail = async (req, res) => {
    const body = req.body;
    
    try {
        const result = await mailManager.sendMail(body);
        return res.status(200).json({
            msg: "Correo enviado con exito",
            result
        });
    } catch(error) {
        return res.status(400).json({
            msg: error.toString()
        });
    }
}

export const passwordRevovery = async (req, res) => {

}