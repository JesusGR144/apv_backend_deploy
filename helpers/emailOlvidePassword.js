import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const emailOlvidePassword = async (datos) => {
    const { nombre, email, token } = datos;

    // Detectar entorno
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        // PRODUCCIÓN - Resend
        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Restablece tu Password',
                html: `<p>Hola: ${nombre}, has solicitado restablecer tu password</p>
                       <p>Sigue el siguiente enlace para generar un nuevo password:</p>
                       <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
                       <p>Si tu no solicitaste este cambio, puedes ignorar este mensaje</p>`
            });
            console.log('Email de recuperación enviado a:', email);
        } catch (error) {
            console.error('Error enviando email:', error);
        }
    } else {
        // 🛠️ DESARROLLO - Mailtrap
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: "APV - Administrador de Pacientes de Veterinario",
            to: email,
            subject: "Restablece tu Password",
            text: "Restablece tu Password",
            html: `<p>Hola: ${nombre}, has solicitado restablecer tu password</p>
                   <p>Sigue el siguiente enlace para generar un nuevo password:</p>
                   <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
                   <p>Si tu no solicitaste este cambio, puedes ignorar este mensaje</p>`
        });
    }
};

export default emailOlvidePassword;