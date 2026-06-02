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

async function seed() {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = 1)
            BEGIN
                SET IDENTITY_INSERT Users ON;
                INSERT INTO Users (Id, Name, Email, PasswordHash, Role, CreatedAt)
                VALUES (1, 'Admin', 'admin@ticketsystem.com', 'dummyhash123', 'Admin', GETDATE());
                SET IDENTITY_INSERT Users OFF;
            END
        `);
        console.log("User seeded!");
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
