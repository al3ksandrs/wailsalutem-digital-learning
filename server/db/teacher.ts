import { PoolClient } from 'pg';


export async function getTeacherDashboard(client: PoolClient, teacherId: number) {
  const helpRequestsRes = await client.query(
    `SELECT status, COUNT(*)::int AS count
     FROM help_request
     WHERE assignedTeacher = $1
     GROUP BY status`,
    [teacherId]
  );

  const suggestedMatchesRes = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM help_request
     WHERE assignedTeacher IS NULL
       AND subject_id IN (
         SELECT subject_id FROM teacher_subject WHERE teacher_id = $1
       )`,
    [teacherId]
  );

  const studentsRes = await client.query(
    `SELECT COUNT(DISTINCT student_id)::int AS count
     FROM help_request
     WHERE assignedTeacher = $1`,
    [teacherId]
  );

  return {
    helpRequests: helpRequestsRes.rows ?? [],
    suggestedMatches: (suggestedMatchesRes.rows[0]?.count ?? 0),
    students: (studentsRes.rows[0]?.count ?? 0),
  };
}


export async function getTeacherHelpRequests(client: PoolClient, teacherId: number) {
  const result = await client.query(
    `SELECT hr.id, hr.description, hr.status, hr.location, hr.startTime, hr.endTime,
            s.name AS subject, u.name AS studentName
     FROM help_request hr
     JOIN subject s ON s.id = hr.subject_id
     JOIN student st ON st.user_id = hr.student_id
     JOIN users u ON u.id = st.user_id
     WHERE hr.assignedTeacher = $1
     ORDER BY hr.startTime DESC`,
    [teacherId]
  );

  return result.rows ?? [];
}


export async function getSuggestedMatches(client: PoolClient, teacherId: number) {
  const result = await client.query(
    `SELECT hr.id, hr.description, hr.status, hr.location, hr.startTime, hr.endTime,
            s.name AS subject, u.name AS studentName
     FROM help_request hr
     JOIN subject s ON s.id = hr.subject_id
     JOIN student st ON st.user_id = hr.student_id
     JOIN users u ON u.id = st.user_id
     WHERE hr.assignedTeacher IS NULL
       AND hr.subject_id IN (
         SELECT subject_id FROM teacher_subject WHERE teacher_id = $1
       )
     ORDER BY hr.startTime DESC`,
    [teacherId]
  );

  return result.rows ?? [];
}


export async function updateHelpRequestStatus(
  client: PoolClient,
  teacherId: number,
  requestId: number,
  newStatus: 'Accepted' | 'Rejected'
) {
  const result = await client.query(
    `UPDATE help_request
     SET status = $1, assignedTeacher = $2
     WHERE id = $3 AND assignedTeacher = $2 OR assignedTeacher IS NULL
     RETURNING *`,
    [newStatus, teacherId, requestId]
  );

  return result.rows[0] ?? null;
}


export async function acceptSuggestedMatch(
  client: PoolClient,
  teacherId: number,
  requestId: number
) {
  const result = await client.query(
    `UPDATE help_request
     SET assignedTeacher = $1
     WHERE id = $2 AND assignedTeacher IS NULL
     RETURNING *`,
    [teacherId, requestId]
  );

  return result.rows[0] ?? null;
}


export async function removeStudent(client: PoolClient, teacherId: number, studentId: number) {
  const result = await client.query(
    `DELETE FROM help_request
     WHERE assignedTeacher = $1 AND student_id = $2 AND status = 'Accepted'`,
    [teacherId, studentId]
  );

  return (result.rowCount ?? 0) > 0;
}
