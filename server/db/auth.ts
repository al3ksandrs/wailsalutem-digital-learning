import { PoolClient, QueryResult } from 'pg';

const STATUS_PENDING = 'Pending';
const STATUS_APPROVED = 'Approved';

// Types representing the DB row
type UserRow = {
  id: number;
  email: string;
  password: string;
  role: 'Student' | 'Teacher' | 'Admin';
  name: string;
  status: string;
};

// Input type for creation
type CreateUserParams = {
  email: string;
  name: string;
  role: 'Student' | 'Teacher';
  password: string;
  // Student specific
  education?: string;
  schoolYear?: number;
  schoolProfile?: string;
  // Teacher specific
  expertise?: string;
  bio?: string;
  subjects?: string[];
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

// Student profile creation
async function createStudentProfile(client: PoolClient, userId: number, data: CreateUserParams) {
  if (!data.education) {
    throw new Error('Education level is required for students');
  }
  const studentQuery = `
        INSERT INTO student (user_id, education, schoolYear, schoolProfile, location)
        VALUES ($1, $2, $3, $4, $5)
    `;
  // We use a placeholder for location for now
  await client.query(studentQuery, [
    userId,
    data.education,
    data.schoolYear || null,
    data.schoolProfile || null,
    'Unknown'
  ]);
}

// Subject linking for teachers
async function linkTeacherSubjects(client: PoolClient, teacherId: number, subjects: string[]) {
  for (const subjectName of subjects) {
    const cleanName = subjectName.trim();

    let subjectId;
    const findSubject = await client.query(
      'SELECT id FROM subject WHERE name ILIKE $1',
      [cleanName]
    );

    if (findSubject.rows.length > 0) {
      subjectId = findSubject.rows[0].id;
    } else {
      const newSubject = await client.query(
        'INSERT INTO subject (name) VALUES ($1) RETURNING id',
        [cleanName]
      );
      subjectId = newSubject.rows[0].id;
    }

    await client.query(
      'INSERT INTO teacher_subject (teacher_id, subject_id) VALUES ($1, $2)',
      [teacherId, subjectId]
    );
  }
}

// Teacher profile creation
async function createTeacherProfile(client: PoolClient, userId: number, data: CreateUserParams) {
  const teacherQuery = `
        INSERT INTO teacher (user_id, expertise, bio, location)
        VALUES ($1, $2, $3, $4)
    `;

  // We use a placeholder for location for now, will need to get this dynamically later
  await client.query(teacherQuery, [
    userId,
    data.expertise || '',
    data.bio || '',
    'Amsterdam'
  ]);

  if (data.subjects && data.subjects.length > 0) {
    await linkTeacherSubjects(client, userId, data.subjects);
  }
}

export async function createUser(client: PoolClient, data: CreateUserParams) {
  try {
    // Starts transaction
    await client.query('BEGIN');

    const initialStatus = data.role === 'Student' ? STATUS_APPROVED : STATUS_PENDING;

    // Inserts into users table
    const userQuery = `
      INSERT INTO users (email, name, role, password, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, role, name, status
    `;

    const userResult = await client.query(userQuery, [
      data.email,
      data.name,
      data.role,
      data.password,
      initialStatus
    ]);

    const newUser = userResult.rows[0];

    // Inserts into specific role table using helpers
    if (data.role === 'Student') {
      await createStudentProfile(client, newUser.id, data);
    } else if (data.role === 'Teacher') {
      await createTeacherProfile(client, newUser.id, data);
    }

    // Commits transaction
    await client.query('COMMIT');

    // Returns the combined user object
    return {
      ...newUser,
      education: data.education,
      schoolYear: data.schoolYear,
      schoolProfile: data.schoolProfile,
      expertise: data.expertise,
      subjects: data.subjects
    };

  } catch (error) {
    // Rollback on any error
    await client.query('ROLLBACK');
    throw error;
  }
}