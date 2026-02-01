
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    console.log('rendering')


  return (

      <AuthProvider>
       <BrowserRouter>
        <Navbar />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  )
}

export default App
