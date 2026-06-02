const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    server: 'localhost',
    database: 'TicketSystemDB',
    driver: 'ODBC Driver 17 for SQL Server',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function migrate() {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comments' AND xtype='U')
            BEGIN
                CREATE TABLE Comments (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    TicketId INT NOT NULL FOREIGN KEY REFERENCES Tickets(Id),
                    UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                    Content NVARCHAR(MAX) NOT NULL,
                    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                    IsSystemMessage BIT NOT NULL DEFAULT 0
                );
                PRINT 'Table Comments created successfully.';
            END
            ELSE
            BEGIN
                PRINT 'Table Comments already exists.';
            END
        `);
        console.log("Migration 002 completed successfully!");
        process.exit(0);
    } catch(err) {
        console.error("Migration failed: ", err);
        process.exit(1);
    }
}
migrate();
