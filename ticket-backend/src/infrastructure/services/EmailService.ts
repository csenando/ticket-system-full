// Eliminamos nodemailer de aquí ya que Render bloquea los puertos SMTP
// Usaremos la nueva API Serverless alojada en Vercel que no tiene restricciones

export class EmailService {
    async sendTicketAssignedEmail(toEmail: string, agentName: string, ticketTitle: string, ticketId: string | number) {
        try {
            const response = await fetch('https://ticket-system-frontend-rho.vercel.app/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    toEmail,
                    agentName,
                    ticketTitle,
                    ticketId
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('[EmailService] Error desde Vercel:', data.error);
            } else {
                console.log(`[EmailService] Petición de correo enviada con éxito a Vercel`);
            }
        } catch (error) {
            console.error('[EmailService] Error contactando a la API de correos:', error);
        }
    }
}

