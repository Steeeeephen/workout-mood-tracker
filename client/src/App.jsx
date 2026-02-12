
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DayView from "./pages/DayView.jsx";
import Register from "./pages/Register.jsx";

function App() {
    console.log('rendering')


  return (
      <div className="min-h-screen flex flex-col">
          <AuthProvider>
           <BrowserRouter>
            <Navbar />
              <Routes>
                  <Route path="/" element={<Home />}/>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
                  <Route path="/day/:date" element={<DayView />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
      </div>
  )
}

export default App
