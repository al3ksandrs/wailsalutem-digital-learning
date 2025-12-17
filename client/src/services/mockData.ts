import { Role, type UserProfile, type Teacher, type Student, EducationLevel, UserStatus } from '../../../common/types';
import { DEFAULT_SUBJECTS } from '../../../common/constants';

// simulates a delay
export const MOCK_API_DELAY_MS = 800;

// fake db
export const MOCK_USERS: UserProfile[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'teacher@test.com',
    status: UserStatus.Approved,
    role: Role.Teacher,
    expertise: 'Math, Physics',
    location: 'Amsterdam',
    bio: 'Experienced science teacher.'
  } as Teacher,
  {
    id: 2,
    name: 'Jane Smith',
    email: 'student@test.com',
    status: UserStatus.Approved,
    role: Role.Student,
    education: EducationLevel.VWO,
    schoolYear: 4,
    location: 'Rotterdam'
  } as Student
];

export const MOCK_SUBJECTS = DEFAULT_SUBJECTS.map((name, index) => ({ id: index + 1, name }));