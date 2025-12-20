import { PoolClient, QueryResult } from 'pg';

const STATUS_PENDING = 'Pending';

// Types representing the DB row
type UserRow = {
  id: number;
  email: string;
  password: string;
  role: 'Student' | 'Teacher' | 'Admin';
  name: string;
};

export async function findUserByEmail(client: PoolClient, email: string) {
  const query = `
    SELECT id, email, password, role, name, status
    FROM users 
    WHERE email = $1
  `;
  
  const result: QueryResult<UserRow> = await client.query(query, [email]);
  return result.rows[0];
}

export async function createUser(client: PoolClient, data: { email: string; name: string; role: string; password: string }) {
  const query = `
    INSERT INTO users (email, name, role, password, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, role, name
  `;

  const result = await client.query(query, [
    data.email,
    data.name,
    data.role,
    data.password,
    STATUS_PENDING
  ]);
  
  return result.rows[0];
}