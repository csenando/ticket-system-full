import { getDbConnection } from '../database/connection';
import sql from 'mssql';

export class SqlCommentRepository {
    async findByTicketId(ticketId: number) {
        const pool = getDbConnection();
        const result = await pool.request()
            .input('TicketId', sql.Int, ticketId)
            .query(`
                SELECT c.Id, c.TicketId, c.UserId, c.Content, c.CreatedAt, c.IsSystemMessage,
                       u.Name as UserName, u.Role as UserRole
                FROM Comments c
                JOIN Users u ON c.UserId = u.Id
                WHERE c.TicketId = @TicketId
                ORDER BY c.CreatedAt ASC
            `);
        return result.recordset;
    }

    async create(commentData: { ticketId: number; userId: number; content: string; isSystemMessage?: boolean }) {
        const pool = getDbConnection();
        const request = pool.request();
        
        request.input('TicketId', sql.Int, commentData.ticketId);
        request.input('UserId', sql.Int, commentData.userId);
        request.input('Content', sql.NVarChar, commentData.content);
        request.input('IsSystem', sql.Bit, commentData.isSystemMessage ? 1 : 0);

        const result = await request.query(`
            INSERT INTO Comments (TicketId, UserId, Content, CreatedAt, IsSystemMessage)
            OUTPUT inserted.*
            VALUES (@TicketId, @UserId, @Content, GETDATE(), @IsSystem)
        `);

        return result.recordset[0];
    }
}
