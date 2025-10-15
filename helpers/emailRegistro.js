import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const emailRegistro = async (datos) => {
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
                subject: 'Comprueba tu cuenta en APV',
                html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV</p>
                       <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:</p>
                       <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
                       <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
            });
            console.log('Email de registro enviado a:', email);
        } catch (error) {
            console.error('Error enviando email:', error);
        }
    } else {
        // DESARROLLO - Mailtrap
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
            subject: "Comprueba tu cuenta en APV",
            text: "Comprueba tu cuenta en APV",
            html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV</p>
                   <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:</p>
                   <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
                   <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
        });
    }
};

export default emailRegistro;