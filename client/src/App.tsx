import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentMainPage from './pages/StudentMainPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/student" element={<StudentMainPage />} />
    </Routes>
  );
}

export default App;