
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Calendar from "./pages/Calendar.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DayView from "./pages/DayView.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

function App() {
    console.log('rendering')


  return (
      <div className="min-h-screen flex flex-col">
          <AuthProvider>
           <BrowserRouter>
            <Navbar />
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>}/>
                  <Route path="/day/:date" element={<ProtectedRoute><DayView /></ProtectedRoute>} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
      </div>
  )
}

export default App
