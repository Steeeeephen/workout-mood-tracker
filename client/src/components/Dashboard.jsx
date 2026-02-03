import React, {useEffect} from 'react'
import {useAuth} from "../context/AuthContext.jsx";
import WeeklyView from "./WeeklyView.jsx";

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
        <div className="w-3/5 m-auto">
            <title>{user?.first_name}'s Dashboard</title>
            <h1 className="text-3xl">Welcome, {user?.first_name}</h1>
            <WeeklyView />
        </div>

    )
}
export default Dashboard
