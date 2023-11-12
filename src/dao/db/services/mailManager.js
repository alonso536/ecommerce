import { transport } from "../../../config/mailTransport.js"; 

class MailManager {

    async sendMail({ to, subject, body }) {
        try {
            const result = await transport.sendMail({
                from: `Test<${process.env.MAIL_USER}>`,
                to,
                subject,
                html: `
                    <h1>${subject}</h1>
                    <div>${body}</div>
                `,
                attachments: []
            });

            return result;
        } catch(error) {
            throw new Error(`No se pudo enviar el correo`);
        }

    }
}

export default MailManager;