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

async function test() {
    try {
        await sql.connect(dbConfig);
        console.log("SUCCESS!");
        process.exit(0);
    } catch(err) {
        console.error("FAIL:", err);
        process.exit(1);
    }
}
test();
