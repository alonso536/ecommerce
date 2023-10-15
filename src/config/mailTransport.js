import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});