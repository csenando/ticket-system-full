import sql from 'mssql';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

async function initDB() {
    try {
        console.log('Connecting to Somee...');
        const pool = await sql.connect(dbConfig);
        console.log('Connected!');

        // Run Users table creation
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
            BEGIN
                CREATE TABLE Users (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(255) NOT NULL UNIQUE,
                    PasswordHash NVARCHAR(255) NOT NULL,
                    Role NVARCHAR(50) NOT NULL DEFAULT 'Usuario Final',
                    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                    UpdatedAt DATETIME NULL
                );
            END
        `);
        console.log('Users table created/verified');

        // Run Tickets table creation
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tickets' AND xtype='U')
            BEGIN
                CREATE TABLE Tickets (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Title NVARCHAR(200) NOT NULL,
                    Description NVARCHAR(MAX) NOT NULL,
                    Priority NVARCHAR(50) NOT NULL DEFAULT 'Low',
                    Status NVARCHAR(50) NOT NULL DEFAULT 'Open',
                    Category NVARCHAR(100) NULL,
                    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    AssignedAgentId INT NULL FOREIGN KEY REFERENCES Users(Id),
                    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                    UpdatedAt DATETIME NULL
                );
            END
        `);
        console.log('Tickets table created/verified');

        // Run Comments table creation
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comments' AND xtype='U')
            BEGIN
                CREATE TABLE Comments (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    TicketId INT NOT NULL FOREIGN KEY REFERENCES Tickets(Id),
                    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    Content NVARCHAR(MAX) NOT NULL,
                    IsSystemMessage BIT NOT NULL DEFAULT 0,
                    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
                );
            END
        `);
        console.log('Comments table created/verified');

        console.log('Database initialized successfully on Somee!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing DB:', err);
        process.exit(1);
    }
}

initDB();
