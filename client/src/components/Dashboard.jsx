import React, {useEffect} from 'react'
import {useAuth} from "../context/AuthContext.jsx";

const Dashboard = () => {

    const { user, loading } = useAuth();

    useEffect(() => {
        // Setting page title
        if (user?.first_name){
            document.title = `${user?.first_name}'s Dashboard`;
        } else {
            document.title = 'Dashboard';
        }
    }, [user]);


    return (
        <>
            <title>{user?.first_name}'s Dashboard</title>
            <h1>Welcome, {user?.first_name}</h1>
        </>

    )
}
export default Dashboard
