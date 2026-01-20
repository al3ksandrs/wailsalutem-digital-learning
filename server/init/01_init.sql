CREATE TYPE roles AS ENUM ('Student', 'Teacher', 'Admin');
CREATE TYPE user_status AS ENUM ('Approved', 'Pending', 'Blocked');
CREATE TYPE education_level AS ENUM ('Basisschool', 'VMBO', 'HAVO', 'VWO', 'HBO', 'WO');
CREATE TYPE request_status AS ENUM ('Accepted', 'Pending', 'Rejected');
CREATE TYPE days AS ENUM (
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role roles NOT NULL,
    status user_status DEFAULT 'Pending'
);

CREATE TABLE student (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    education education_level NOT NULL,
    schoolYear INT,
    schoolProfile TEXT,
    location TEXT
);

CREATE TABLE teacher (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    expertise TEXT,
    bio TEXT,
    cv TEXT,
    location TEXT
);

CREATE TABLE admin (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE subject (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE teacher_subject (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher(user_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher(user_id) ON DELETE CASCADE,
    dayOfTheWeek days NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    isBooked BOOLEAN DEFAULT FALSE
);

CREATE TABLE help_request (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student(user_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subject(id),
    description TEXT,
    status request_status DEFAULT 'Pending',
    location TEXT,
    assignedTeacher INT REFERENCES teacher(user_id) ON DELETE SET NULL,
    startTime TIMESTAMP,
    endTime TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    attachments TEXT[] DEFAULT '{}',
    sender_id INT REFERENCES users(id) ON DELETE SET NULL,
    receiver_id INT REFERENCES users(id) ON DELETE SET NULL
);