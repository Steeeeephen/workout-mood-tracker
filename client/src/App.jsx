import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Calendar from './pages/Calendar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DayView from './pages/DayView.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import NotificationToast from './components/NotificationToast.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <main className="min-h-screen flex flex-col">
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <NotificationToast />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/day/:date"
                element={
                  <ProtectedRoute>
                    <DayView />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </main>
  );
}

export default App;
