// Feature/test branch - NSCC Wellness App
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

import TopBar from './components/layout/TopBar';
import CrisisButton from './components/layout/CrisisButton';
import Home from './pages/Home';
import WellnessTracker from './pages/WellnessTracker';
import Resources from './pages/Resources';
import Login from './pages/Login';

function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="view-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/checkin" element={<ProtectedRoute><WellnessTracker /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        </Routes>
      </div>
      <CrisisButton />
    </div>
  );
}

export default App;