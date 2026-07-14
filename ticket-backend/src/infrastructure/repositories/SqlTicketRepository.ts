import { ITicketRepository } from '../../domain/interfaces/ITicketRepository';
import { Ticket } from '../../domain/entities/Ticket';
import { getDbConnection } from '../database/connection';
import sql from 'mssql';

export class SqlTicketRepository implements ITicketRepository {
    async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
        const pool = getDbConnection();
        const request = pool.request();
        
        request.input('Title', sql.NVarChar, ticket.title);
        request.input('Description', sql.NVarChar, ticket.description);
        request.input('Priority', sql.NVarChar, ticket.priority);
        request.input('Status', sql.NVarChar, ticket.status);
        request.input('Category', sql.NVarChar, ticket.category);
        request.input('UserId', sql.Int, ticket.userId);
        request.input('AssignedAgentId', sql.Int, ticket.assignedAgentId);
        request.input('ImageUrl', sql.NVarChar, ticket.imageUrl || null);

        const result = await request.query(`
            INSERT INTO Tickets (Title, Description, Priority, Status, Category, UserId, AssignedAgentId, ImageUrl, CreatedAt)
            OUTPUT inserted.*
            VALUES (@Title, @Description, @Priority, @Status, @Category, @UserId, @AssignedAgentId, @ImageUrl, GETDATE())
        `);

        return this.mapToEntity(result.recordset[0]);
    }

    async findById(id: number): Promise<Ticket | null> {
        const pool = getDbConnection();
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Tickets WHERE Id = @Id');

        if (result.recordset.length === 0) return null;
        return this.mapToEntity(result.recordset[0]);
    }

    async findAll(): Promise<Ticket[]> {
        const pool = getDbConnection();
        const result = await pool.request().query('SELECT * FROM Tickets ORDER BY CreatedAt DESC');
        return result.recordset.map(row => this.mapToEntity(row));
    }

    async updateStatus(id: number, status: string): Promise<Ticket | null> {
        const pool = getDbConnection();
        const request = pool.request();
        
        request.input('Id', sql.Int, id);
        request.input('Status', sql.NVarChar, status);

        const result = await request.query(`
            UPDATE Tickets
            SET Status = @Status, UpdatedAt = GETDATE()
            OUTPUT inserted.*
            WHERE Id = @Id
        `);

        if (result.recordset.length === 0) return null;
        return this.mapToEntity(result.recordset[0]);
    }

    async assignToAgent(id: number, agentId: number | null): Promise<Ticket | null> {
        const pool = getDbConnection();
        const request = pool.request();
        
        request.input('Id', sql.Int, id);
        request.input('AssignedAgentId', sql.Int, agentId);

        const result = await request.query(`
            UPDATE Tickets
            SET AssignedAgentId = @AssignedAgentId, UpdatedAt = GETDATE()
            OUTPUT inserted.*
            WHERE Id = @Id
        `);

        if (result.recordset.length === 0) return null;
        return this.mapToEntity(result.recordset[0]);
    }

    private mapToEntity(row: any): Ticket {
        return new Ticket(
            row.Id,
            row.Title,
            row.Description,
            row.Priority,
            row.Status,
            row.Category,
            row.UserId,
            row.AssignedAgentId,
            row.CreatedAt,
            row.UpdatedAt,
            row.ImageUrl
        );
    }
}
