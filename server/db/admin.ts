import { PoolClient } from 'pg';
import bcrypt from 'bcrypt';

export async function getAllUsers(client: PoolClient, role?: string) {
  const result = await client.query(
    `SELECT id, name, email, role, status FROM users ${role ? 'WHERE role = $1' : ''} ORDER BY id`,
    role ? [role] : []
  );
  return result.rows;
}

export async function getUserById(client: PoolClient, userId: number) {
  const result = await client.query(
    `SELECT id, name, email, role, status FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0] ?? null;
}

export async function createUser(
  client: PoolClient,
  data: { name: string; email: string; password: string; role: string }
) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await client.query(
    `INSERT INTO users (name, email, password, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, role, status`,
    [data.name, data.email, hashedPassword, data.role]
  );

  return result.rows[0];
}

export async function updateUser(
  client: PoolClient,
  userId: number,
  data: { name?: string; email?: string; role?: string; status?: string }
) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key of ['name', 'email', 'role', 'status'] as const) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(data[key]);
      idx++;
    }
  }

  if (fields.length === 0) return null;

  values.push(userId);

  const result = await client.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, email, role, status`,
    values
  );
  return result.rows[0] ?? null;
}

export async function deleteUser(client: PoolClient, userId: number) {
  const result = await client.query(
    `DELETE FROM users WHERE id = $1`,
    [userId]
  );
  return result.rowCount === 1;
}

export async function updateUserStatus(client: PoolClient, userId: number, status: string) {
  const result = await client.query(
    `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, role, status`,
    [status, userId]
  );
  return result.rows[0] ?? null;
}
