
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DayView from "./components/DayView.jsx";

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
              </Routes>
            </BrowserRouter>
          </AuthProvider>
      </div>
  )
}

export default App
