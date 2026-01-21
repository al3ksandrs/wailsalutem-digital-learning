import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPassword from './pages/ResetPassword';
import RegisterPage from './pages/Registration/RegisterPage'
import StudentMainPage from './pages/Student/StudentMainPage';
import StudentRequests from './pages/Student/StudentRequests';
import StudentConnections from './pages/Student/StudentConnections';
import StudentCalendar from './pages/Student/StudentCalendar';
import TeacherMainPage from './pages/Teacher/TeacherMainPage';
import TeacherConnections from './pages/Teacher/TeacherConnections';
import RegisterStudentPart2 from './pages/Registration/RegisterStudentPart2';
import RegisterStudentPart3 from './pages/Registration/RegisterStudentPart3';
import RegisterTeacherPart2 from './pages/Registration/RegisterTeacherPart2';
import RegisterTeacherPart3 from './pages/Registration/RegisterTeacherPart3';
import RegisterTeacherPart4 from './pages/Registration/RegisterTeacherPart4';
import RegisterTeacherWaiting from './pages/Registration/RegisterTeacherWaiting';
import Header from './components/Header';
import { useState } from 'react';
import Modal from './components/Modal';
import TeacherRequests from './pages/Teacher/TeacherRequests';
import WSButton from './components/WSButton';

function PagesWithHeader() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function logout() {
    navigate('/')
  }

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
        <div className="pt-5 has-text-centered">
          <WSButton
            label="Uitloggen"
            type="submit"
            size="normal"
            onClick={logout}
          />
        </div>
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
        <Route path="/mijnverzoeken" element={<StudentRequests />} />
        <Route path="/mijnconnecties" element={<StudentConnections />} />
        <Route path="/kalender" element={<StudentCalendar />} />
        <Route path="/docent" element={<TeacherMainPage />} />
        <Route path="/studentverzoeken" element={<TeacherRequests />} />
        <Route path="/mijnstudenten" element={<TeacherConnections />} />
      </Route>
    </Routes>
  );
}

export default App;