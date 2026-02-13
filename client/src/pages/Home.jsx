import React from 'react'
import Auth from "./Auth.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import Dashboard from "./Dashboard.jsx";

const Home = () => {
    const { user } = useAuth();

    return (
        <>{user ? <Dashboard /> : <Auth />}</>
    )
}
export default Home
