import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentMainPage from './pages/StudentMainPage';
import RegisterTeacherPart2 from './pages/RegisterTeacherPart2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register-teacher-2" element={<RegisterTeacherPart2 />} />
      <Route path="/student" element={<StudentMainPage />} />
    </Routes>
  );
}

export default App;