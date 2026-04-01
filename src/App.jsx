import { Routes, Route } from 'react-router-dom';

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkin" element={<WellnessTracker />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
      <CrisisButton />
    </div>
  );
}

export default App;