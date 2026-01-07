import { PoolClient } from 'pg';

export async function getAllSubjects(client: PoolClient) {
  const result = await client.query(
    `SELECT id, name FROM subject ORDER BY name`
  );
  return result.rows;
}

export async function getSubjectById(client: PoolClient, subjectId: number) {
  const result = await client.query(
    `SELECT id, name FROM subject WHERE id = $1`,
    [subjectId]
  );
  return result.rows[0] ?? null;
}

export async function createSubject(client: PoolClient, name: string) {
  const result = await client.query(
    `INSERT INTO subject (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

export async function deleteSubject(client: PoolClient, subjectId: number) {
  const result = await client.query(
    `DELETE FROM subject WHERE id = $1`,
    [subjectId]
  );
  return result.rowCount === 1;
}
