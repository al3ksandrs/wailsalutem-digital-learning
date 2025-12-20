import {
  Role,
  type UserProfile,
  type Teacher,
  type Student,
  EducationLevel,
  UserStatus,
  type HelpRequest,
  type Message,
  RequestStatus,
  DayOfWeek,
  type Availability
} from '../../../common/types';
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

export const MOCK_REQUESTS: HelpRequest[] = [
  {
    id: 1,
    studentId: 2,
    subjectId: 1,
    assignedTeacherId: 1,
    description: 'Need some help with math',
    status: RequestStatus.Pending,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Hello, are you available?',
    timestamp: new Date().toISOString(),
  }
];

export const MOCK_AVAILABILITY: Availability[] = [
  {
    id: 1,
    teacherId: 1,
    dayOfWeek: DayOfWeek.Monday,
    startTime: '09:00',
    endTime: '17:00',
    isBooked: false
  }
];