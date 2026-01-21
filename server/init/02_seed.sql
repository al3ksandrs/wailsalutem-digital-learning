-- 1. USERS, we use hashed passwords that are all actually 'test'
-- ==========================================
INSERT INTO users (id, name, email, password, role, status, created_at) VALUES 
-- Teachers
(1, 'test', 'test@teacher.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Teacher', 'Approved', '2025-09-01 10:00:00'),
(2, 'Alan Turing', 'alan@teacher.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Teacher', 'Approved', '2025-10-15 14:30:00'),
(3, 'Maya de Vries', 'maya@teacher.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Teacher', 'Pending', '2026-01-15 09:15:00'),

-- Students
(4, 'test', 'test@student.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Student', 'Approved', '2025-09-10 11:00:00'),
(5, 'John Pork', 'john@student.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Student', 'Approved', '2025-09-12 16:45:00'),
(6, 'Nieuwe Leerling', 'nieuw@student.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Student', 'Pending', '2026-01-20 08:30:00'),

-- Admins
(7, 'admin', 'admin@test.com', '$2b$10$yRFVwtXdUTtepKO8vY0CzO3y6QB.jPMPYYqyyTZZnx2QFZXKpnMZO', 'Admin', 'Approved', '2025-08-01 09:00:00');

-- Updates id to latest value
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. PROFILES
-- ==========================================

-- Teacher Profiles
INSERT INTO teacher (user_id, expertise, bio, location) VALUES 
(1, 'Natuurkunde, Wiskunde', 'Gepassioneerd over wetenschap en ik help leerlingen graag de wereld te begrijpen.', 'Utrecht'),
(2, 'Informatica, Wiskunde', 'Gespecialiseerd in logica, algoritmen en calculus.', 'Amsterdam'),
(3, 'Engels, Nederlands, Geschiedenis', 'Literatuurliefhebber en geschiedenisfanaat. Ik help graag met essays en grammatica.', 'Rotterdam');

-- Student Profiles
INSERT INTO student (user_id, education, schoolYear, location, schoolProfile) VALUES 
(4, 'HAVO', 4, 'Utrecht', 'Natuur en Techniek'),
(5, 'VWO', 6, 'Amsterdam', 'Cultuur en Maatschappij'),
(6, 'VMBO', 2, 'Rotterdam', 'Zorg en Welzijn');

-- Admin Profile
INSERT INTO admin (user_id) VALUES (7);

-- 3. SUBJECTS
-- ==========================================
INSERT INTO subject (id, name) VALUES 
(1, 'Wiskunde B'),
(2, 'Natuurkunde'),
(3, 'Scheikunde'),
(4, 'Nederlands'),
(5, 'Engels'),
(6, 'Geschiedenis'),
(7, 'Informatica');

-- 4. TEACHER SUBJECTS (Linking)
-- ==========================================
INSERT INTO teacher_subject (teacher_id, subject_id) VALUES 
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 7),
(3, 4), (3, 5), (3, 6);

-- Updates id to latest value
SELECT setval('subject_id_seq', (SELECT MAX(id) FROM subject));

-- 5. AVAILABILITY
-- ==========================================
INSERT INTO availability (teacher_id, dayOfTheWeek, startTime, endTime, isBooked) VALUES
(1, 'Monday', '2026-01-26 09:00:00', '2026-01-26 12:00:00', FALSE),
(2, 'Tuesday', '2026-01-27 14:00:00', '2026-01-27 17:00:00', FALSE),
(3, 'Wednesday', '2026-01-28 18:00:00', '2026-01-28 20:00:00', FALSE);

-- 6. HELP REQUESTS
-- ==========================================
INSERT INTO help_request (student_id, subject_id, description, status, location, assignedTeacher, startTime, endTime, created_at) VALUES 
(4, 1, 'Ik snap afgeleiden niet, kan iemand mij helpen?', 'Pending', 'Online', NULL, NULL, NULL, '2026-01-19 14:00:00'),
(5, 5, 'Hulp nodig bij het nakijken van mijn essay.', 'Accepted', 'Bibliotheek Amsterdam', 3, '2026-02-10 10:00:00', '2026-02-10 11:00:00', '2025-12-10 09:30:00'),
(4, 2, 'Hulp bij krachten en beweging.', 'Rejected', 'Online', 1, NULL, NULL, '2025-11-05 16:20:00');

-- 7. MESSAGES
-- ==========================================
INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES 
(4, 1, 'Hoi Mevrouw, kunt u mij volgende week helpen met Natuurkunde aub?', '2026-01-15 14:30:00'),
(1, 4, 'Goedeavond, natuurlijk! Bekijk mijn beschikbaarheid tabblad even.', '2026-01-15 14:35:00'),
(4, 1, 'Ik zie dat u maandag vrij bent, ik zal een slot boeken.', '2026-01-15 14:36:00');