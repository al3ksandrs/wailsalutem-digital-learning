import { Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPassword from './pages/ResetPassword';
import RegisterPage from './pages/Registration/RegisterPage'
import StudentMainPage from './pages/StudentMainPage';
import StudentRequests from './pages/Student/StudentRequests';
import StudentConnections from './pages/Student/StudentConnections';
import RegisterStudentPart2 from './pages/Registration/RegisterStudentPart2';
import RegisterStudentPart3 from './pages/Registration/RegisterStudentPart3';
import RegisterTeacherPart2 from './pages/Registration/RegisterTeacherPart2';
import RegisterTeacherPart3 from './pages/Registration/RegisterTeacherPart3';
import RegisterTeacherPart4 from './pages/Registration/RegisterTeacherPart4';
import RegisterTeacherWaiting from './pages/Registration/RegisterTeacherWaiting';
import Header from './components/Header';
import { useState } from 'react';
import Modal from './components/Modal';

function PagesWithHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Header onLogout={() => setIsModalOpen(true)} />
      <Outlet />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Weet je zeker dat je wilt uitloggen?"
      >
        <p>Als je uitlogt, wordt je sessie beëindigd.</p>
      </Modal>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

      <Route path="/register-student-2" element={<RegisterStudentPart2 />} />
      <Route path="/register-student-3" element={<RegisterStudentPart3 />} />

      <Route path="/register-teacher-2" element={<RegisterTeacherPart2 />} />
      <Route path="/register-teacher-3" element={<RegisterTeacherPart3 />} />
      <Route path="/register-teacher-4" element={<RegisterTeacherPart4 />} />
      <Route path="/register-teacher-waiting" element={<RegisterTeacherWaiting />} />

      <Route element={<PagesWithHeader />}>
        <Route path="/student" element={<StudentMainPage />} />
        <Route path="/verzoeken" element={<StudentRequests />} />
        <Route path="/connecties" element={<StudentConnections />} />
      </Route>
    </Routes>
  );
}

export default App;