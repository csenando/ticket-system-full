import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { toEmail, agentName, ticketTitle, ticketId } = req.body;

    if (!toEmail || !ticketId) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured in Vercel');
        return res.status(500).json({ error: 'Servidor de correo no configurado' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });

        const mailOptions = {
            from: `"Ticket System" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `📌 Nuevo Ticket Asignado: #${ticketId}`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #0f172a; margin: 0;">Sistema de Tickets</h2>
                </div>
                <h3 style="color: #3b82f6;">¡Hola ${agentName}!</h3>
                <p>Se te ha asignado un nuevo ticket en el sistema.</p>
                <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px;"><strong>Ticket #${ticketId}:</strong> ${ticketTitle}</p>
                </div>
                <p>Por favor, ingresa al sistema para revisar los detalles y comenzar a trabajar en él.</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://ticket-system-frontend-rho.vercel.app/ticket/${ticketId}" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Ver Ticket</a>
                </div>
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px;">
                    Este es un correo automático. Por favor no respondas a este mensaje.
                </p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: error.message });
    }
}
