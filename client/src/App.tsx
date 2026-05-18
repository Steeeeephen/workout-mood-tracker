import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Calendar from './pages/Calendar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DayView from './pages/DayView';
import Register from './pages/Register';
import Login from './pages/Login';
import NotificationToast from './components/NotificationToast';
import { NotificationProvider } from './context/NotificationContext';
import Footer from './components/Footer';

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
