// Feature/test branch - NSCC Wellness App
import { Routes, Route } from 'react-router-dom';


import TopBar from './components/layout/TopBar';
import SupportFooter from './components/layout/SupportFooter';
import Home from './pages/Home';
import WellnessTracker from './pages/WellnessTracker';
import Resources from './pages/Resources';
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {
  return (
    <>
      <TopBar />
      <div className="view-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkin" element={<WellnessTracker />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
      <SupportFooter />
    </>
  );
}

export default App;