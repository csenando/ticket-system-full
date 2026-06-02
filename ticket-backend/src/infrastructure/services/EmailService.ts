import nodemailer from 'nodemailer';
import dns from 'dns';

// Forzar a Node.js a priorizar IPv4 sobre IPv6 para evitar el error ENETUNREACH en Render
dns.setDefaultResultOrder('ipv4first');

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });
    }

    async sendTicketAssignedEmail(toEmail: string, agentName: string, ticketTitle: string, ticketId: string | number) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('[EmailService] SMTP credentials not set. Skipping email notification.');
            return;
        }

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
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/ticket/${ticketId}" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Ver Ticket</a>
                </div>
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px;">
                    Este es un correo automático. Por favor no respondas a este mensaje.
                </p>
            </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] Email sent to ${toEmail}: ${info.messageId}`);
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
        }
    }
}
