import sql from 'mssql';
import dotenv from 'dotenv';

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

let pool: sql.ConnectionPool | null = null;

export const connectToDatabase = async (): Promise<sql.ConnectionPool> => {
    if (pool) return pool;
    try {
        pool = await sql.connect(dbConfig);
        console.log('[Database]: Connected to SQL Server successfully (Windows Auth - ODBC 17)!');
        return pool;
    } catch (err) {
        console.error('[Database]: Connection Failed! Bad Config: ', err);
        throw err;
    }
};

export const getDbConnection = () => {
    if (!pool) {
        throw new Error("[Database]: Database not connected. Call connectToDatabase first.");
    }
    return pool;
};
