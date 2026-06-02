import { google } from 'googleapis';

export class EmailService {
    async sendTicketAssignedEmail(toEmail: string, agentName: string, ticketTitle: string, ticketId: string | number) {
        if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
            console.warn('[EmailService] Faltan credenciales OAuth2. No se enviará el correo.');
            return;
        }

        try {
            const oAuth2Client = new google.auth.OAuth2(
                process.env.GMAIL_CLIENT_ID,
                process.env.GMAIL_CLIENT_SECRET,
                'https://developers.google.com/oauthplayground'
            );

            oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

            const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

            const subject = `📌 Nuevo Ticket Asignado: #${ticketId}`;
            const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
            
            const htmlBody = `
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
            `;

            const messageParts = [
                `To: ${toEmail}`,
                `Subject: ${utf8Subject}`,
                `Content-Type: text/html; charset="UTF-8"`,
                'MIME-Version: 1.0',
                '',
                htmlBody
            ];
            const message = messageParts.join('\n');

            // La API de Gmail requiere que el mensaje esté codificado en Base64 URL-safe
            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });

            console.log(`[EmailService] Email enviado con éxito vía Gmail API: ${res.data.id}`);
        } catch (error: any) {
            console.error('[EmailService] Error enviando correo por Gmail API:', error.message);
        }
    }
}
