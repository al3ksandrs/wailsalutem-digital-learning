import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Registration/RegisterPage'
import StudentMainPage from './pages/StudentMainPage';


import RegisterStudentPart2 from './pages/Registration/RegisterStudentPart2';
import RegisterStudentPart3 from './pages/Registration/RegisterStudentPart3';


import RegisterTeacherPart2 from './pages/Registration/RegisterTeacherPart2';
import RegisterTeacherPart3 from './pages/Registration/RegisterTeacherPart3';
import RegisterTeacherPart4 from './pages/Registration/RegisterTeacherPart4';
import RegisterTeacherWaiting from './pages/Registration/RegisterTeacherWaiting';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/register-student-2" element={<RegisterStudentPart2 />} />
      <Route path="/register-student-3" element={<RegisterStudentPart3 />} />

      <Route path="/register-teacher-2" element={<RegisterTeacherPart2 />} />
      <Route path="/register-teacher-3" element={<RegisterTeacherPart3 />} />
      <Route path="/register-teacher-4" element={<RegisterTeacherPart4 />} />
      <Route path="/register-teacher-waiting" element={<RegisterTeacherWaiting />} />

      <Route path="/student" element={<StudentMainPage />} />
    </Routes>
  );
}

export default App;