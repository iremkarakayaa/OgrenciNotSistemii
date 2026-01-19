import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Students from './pages/Students';
import Lessons from './pages/Lessons';
import Grading from './pages/Grading';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="students" element={<Students />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="grading" element={<Grading />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
