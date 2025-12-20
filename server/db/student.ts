import { PoolClient } from 'pg';


export async function getStudentDashboard(client: PoolClient, studentId: number) {
  const result = await client.query(
    `SELECT status, COUNT(*)::int AS count FROM help_request WHERE student_id = $1 GROUP BY status`,
    [studentId]
  );
  return result.rows;
}


export async function createHelpRequest(
  client: PoolClient,
  data: {
    studentId: number;
    subjectId: number;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
  }
) {
  const result = await client.query(
    `INSERT INTO help_request (student_id, subject_id, description, location, startTime, endTime)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.studentId,
      data.subjectId,
      data.description,
      data.location,
      data.startTime,
      data.endTime,
    ]
  );
  return result.rows[0];
}


export async function getStudentHelpRequests(client: PoolClient, studentId: number) {
  const result = await client.query(
    `SELECT hr.id, hr.description, hr.status, hr.location, hr.startTime, hr.endTime,
            s.name AS subject
     FROM help_request hr
     JOIN subject s ON s.id = hr.subject_id
     WHERE hr.student_id = $1
     ORDER BY hr.startTime DESC`,
    [studentId]
  );
  return result.rows;
}


export async function updateHelpRequest(
  client: PoolClient,
  data: {
    requestId: number;
    studentId: number;
    subjectId: number;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
  }
) {
  const result = await client.query(
    `UPDATE help_request
     SET subject_id = $1, description = $2, location = $3, startTime = $4, endTime = $5
     WHERE id = $6 AND student_id = $7 AND status = 'Pending'
     RETURNING *`,
    [
      data.subjectId,
      data.description,
      data.location,
      data.startTime,
      data.endTime,
      data.requestId,
      data.studentId,
    ]
  );
  return result.rows[0] ?? null;
}


export async function deleteHelpRequest(client: PoolClient, studentId: number, requestId: number) {
  const result = await client.query(
    `DELETE FROM help_request WHERE id = $1 AND student_id = $2 AND status = 'Pending'`,
    [requestId, studentId]
  );
  return result.rowCount === 1;
}
