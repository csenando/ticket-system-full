import { getDbConnection } from '../database/connection';
import sql from 'mssql';

export class SqlUserRepository {
    async findByEmail(email: string) {
        const pool = getDbConnection();
        const result = await pool.request()
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (result.recordset.length === 0) return null;
        return result.recordset[0];
    }

    async create(userData: { name: string; email: string; passwordHash: string; role: string }) {
        const pool = getDbConnection();
        const request = pool.request();
        
        request.input('Name', sql.NVarChar, userData.name);
        request.input('Email', sql.NVarChar, userData.email);
        request.input('PasswordHash', sql.NVarChar, userData.passwordHash);
        request.input('Role', sql.NVarChar, userData.role);

        const result = await request.query(`
            INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt)
            OUTPUT inserted.*
            VALUES (@Name, @Email, @PasswordHash, @Role, GETDATE())
        `);

        return result.recordset[0];
    }

    async findAll() {
        const pool = getDbConnection();
        const result = await pool.request().query('SELECT Id, Name, Email, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC');
        return result.recordset;
    }

    async findAgents() {
        const pool = getDbConnection();
        const result = await pool.request().query("SELECT Id, Name FROM Users WHERE Role = 'Agente IT' OR Role = 'Administrador' ORDER BY Name ASC");
        return result.recordset;
    }

    async updateRole(userId: number, role: string) {
        const pool = getDbConnection();
        const result = await pool.request()
            .input('Id', sql.Int, userId)
            .input('Role', sql.NVarChar, role)
            .query(`
                UPDATE Users 
                SET Role = @Role, UpdatedAt = GETDATE()
                OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.Role
                WHERE Id = @Id
            `);
        return result.recordset[0];
    }
}
