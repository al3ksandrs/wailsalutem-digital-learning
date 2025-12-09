// ------------------------------------- Enumerations -------------------------------------
export const UserStatus = {
    Approved: 'approved',
    Blocked: 'blocked',
    Pending: 'pending',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const EducationLevel = {
    Basisschool: 'Basisschool',
    VMBO: 'VMBO',
    HAVO: 'HAVO',
    VWO: 'VWO',
    MBO: 'MBO',
    HBO: 'HBO',
    WO: 'WO',
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

export const RequestStatus = {
    Accepted: 'accepted',
    Pending: 'pending',
    Rejected: 'rejected',
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const DayOfWeek = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export const Role = {
    Student: 'student',
    Teacher: 'teacher',
    Admin: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// ------------------------------------- Entities -------------------------------------
export interface User {
    id: number;
    name: string;
    email: string;
    status: UserStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface Student extends User {
    role: Role; // student
    education: EducationLevel;
    schoolYear: number;
    schoolProfile?: string;
    location?: string;
}

export interface Teacher extends User {
    role: Role; // teacher
    expertise?: string;
    bio?: string;
    location?: string;
    cvUrl?: string;
}

export interface Admin extends User {
    role: Role; // admin
}

export type UserProfile = Student | Teacher | Admin;

export interface Subject {
    id: number;
    name: string;
}

export interface Availability {
    id: number;
    teacherId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    attachments?: string[];
}

export interface HelpRequest {
    id: number;
    studentId: number;
    subjectId: number;
    assignedTeacherId?: number;
    description: string;
    status: RequestStatus;
    location?: string;
    startTime: string;
    endTime: string;

    subject?: Subject;
    student?: Student;
    assignedTeacher?: Teacher;
}

// ------------------------------------- API DTOs -------------------------------------

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: UserProfile;
}

export interface RegisterBaseRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterStudentRequest extends RegisterBaseRequest {
    role: Role; // student
    education: EducationLevel;
    schoolYear: number;
}

export interface RegisterTeacherRequest extends RegisterBaseRequest {
    role: Role; // teacher
    expertise: string;
}