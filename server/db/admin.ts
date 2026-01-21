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

export async function getDashboardStats(client: PoolClient) {
  const query = `
    SELECT
      (SELECT count(*)::int FROM users WHERE role = 'Student') as "totalStudents",
      (SELECT count(*)::int FROM users WHERE role = 'Student' AND created_at >= NOW() - INTERVAL '30 days') as "newStudentsMonth",
      
      (SELECT count(*)::int FROM users WHERE role = 'Teacher') as "totalTeachers",
      (SELECT count(*)::int FROM users WHERE role = 'Teacher' AND created_at >= NOW() - INTERVAL '30 days') as "newTeachersMonth",
      
      (SELECT count(*)::int FROM users WHERE role = 'Teacher' AND status = 'Pending') as "pendingTeachers",
      
      (SELECT count(*)::int FROM subject) as "totalSubjects",
      
      (SELECT count(*)::int FROM help_request WHERE status = 'Pending') as "openHelpRequests",
      (SELECT count(*)::int FROM help_request WHERE created_at >= NOW() - INTERVAL '30 days') as "newRequestsMonth"
  `;
  const result = await client.query(query);
  return result.rows[0];
}

export async function getPendingTeachers(client: PoolClient) {
  // JOIN with teacher table to get expertise, bio, etc
  const result = await client.query(
    `SELECT u.id, u.name, u.email, u.role, u.status, t.expertise, t.bio, t.location
     FROM users u
     JOIN teacher t ON u.id = t.user_id
     WHERE u.role = 'Teacher' AND u.status = 'Pending'
     ORDER BY u.name ASC`
  );
  return result.rows;
}

export async function getOpenHelpRequests(client: PoolClient) {
  // Fetches requests that are still Pending
  const query = `
    SELECT
      hr.id,
      hr.description,
      hr.status,
      hr.location,
      u.name as student_name,
      s.name as subject_name
    FROM help_request hr
    JOIN users u ON hr.student_id = u.id
    LEFT JOIN subject s ON hr.subject_id = s.id
    WHERE hr.status = 'Pending'
    ORDER BY hr.id ASC
  `;
  const result = await client.query(query);
  return result.rows;
}

export async function assignTeacherToRequest(client: PoolClient, requestId: number, teacherId: number) {
  // Updates the assignedTeacher and sets status to Accepted
  const result = await client.query(
    `UPDATE help_request
     SET assignedTeacher = $1, status = 'Accepted'
     WHERE id = $2
     RETURNING *`,
    [teacherId, requestId]
  );
  return result.rows[0];
}

export async function getAcceptedMatches(client: PoolClient) {
  // Fetches requests that are Accepted and have a teacher assigned
  const query = `
    SELECT
      hr.id,
      hr.created_at,
      hr.status,
      hr.location,
      u_student.id as student_id,
      u_student.name as student_name,
      u_teacher.id as teacher_id,
      u_teacher.name as teacher_name,
      s.name as subject_name
    FROM help_request hr
    JOIN users u_student ON hr.student_id = u_student.id
    JOIN users u_teacher ON hr.assignedTeacher = u_teacher.id
    LEFT JOIN subject s ON hr.subject_id = s.id
    WHERE hr.status = 'Accepted'
    ORDER BY hr.created_at DESC
  `;
  const result = await client.query(query);
  return result.rows;
}

export async function createManualMatch(
  client: PoolClient, 
  data: { studentId: number; teacherId: number; subjectId: number }
) {
  // Checks for existing active match to prevent duplicates
  const checkQuery = `
    SELECT id FROM help_request 
    WHERE student_id = $1 
      AND assignedTeacher = $2 
      AND subject_id = $3 
      AND status = 'Accepted'
  `;
  const checkResult = await client.query(checkQuery, [data.studentId, data.teacherId, data.subjectId]);
  
  if (checkResult.rows.length > 0) {
    throw new Error('DUPLICATE_MATCH');
  }

  // Creates a new help_request with status Accepted immediately
  const query = `
    INSERT INTO help_request (student_id, assignedTeacher, subject_id, status, description, location)
    VALUES ($1, $2, $3, 'Accepted', 'Manual match by Admin', 'Online')
    RETURNING *
  `;
  const result = await client.query(query, [data.studentId, data.teacherId, data.subjectId]);
  return result.rows[0];
}

export async function unassignTeacher(client: PoolClient, requestId: number) {
  // Sets the request back to Pending and removes the assigned teacher
  const query = `
    UPDATE help_request
    SET assignedTeacher = NULL, status = 'Pending'
    WHERE id = $1
    RETURNING *
  `;
  const result = await client.query(query, [requestId]);
  return result.rows[0];
}