import { transport } from "../config/mailTransport.js";

export const mail = async (req, res) => {
    const { to, subject, body } = req.body;

    const result = await transport.sendMail({
        from: `Test<${process.env.MAIL_USER}>`,
        to,
        subject,
        html: `
            <p>${body}</p>
        `,
        attachments: []
    });

    return res.status(200).json({
        msg: "Correo enviado con exito",
        result
    });
}