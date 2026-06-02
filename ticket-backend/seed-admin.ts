import sql from 'mssql';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbConfig: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'TicketSystemDB',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function seedAdmin() {
    try {
        const pool = await sql.connect(dbConfig);
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await pool.request()
            .input('Name', sql.NVarChar, 'Admin Principal')
            .input('Email', sql.NVarChar, 'admin@admin.com')
            .input('PasswordHash', sql.NVarChar, hashedPassword)
            .input('Role', sql.NVarChar, 'Administrador')
            .query(`
                IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@admin.com')
                BEGIN
                    INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt)
                    VALUES (@Name, @Email, @PasswordHash, @Role, GETDATE())
                END
            `);
            
        console.log('Admin user seeded! (admin@admin.com / admin123)');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
