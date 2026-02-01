import React from 'react'
import {useAuth} from "../context/AuthContext.jsx";

const Dashboard = () => {

    const { user, loading } = useAuth();


    return (
        <>

            <h1>Welcome, {user?.first_name}</h1>

        </>

    )
}
export default Dashboard
