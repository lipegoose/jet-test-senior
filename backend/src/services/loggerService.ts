import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface LogEntry {
  level: 'info' | 'error' | 'warn' | string;
  message: string;
  details?: any;
}

export async function logToDatabase(entry: LogEntry): Promise<void> {
  const { level, message, details } = entry;
  try {
    await pool.query(
      `INSERT INTO logs (level, message, details) VALUES ($1, $2, $3)`,
      [level, message, details ? JSON.stringify(details) : null]
    );
  } catch (error) {
    console.error('Erro ao gravar log no banco de dados:', error);
  }
}

export function logInfo(message: string, details?: any): void {
  logToDatabase({ level: 'info', message, details });
}

export function logWarn(message: string, details?: any): void {
  logToDatabase({ level: 'warn', message, details });
}

export function logError(message: string, details?: any): void {
  logToDatabase({ level: 'error', message, details });
}
