import mysql from "mysql2/promise"

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "laundry_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool

// Helper function to execute queries
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const [results] = await pool.execute(sql, params)
  return results as T
}
