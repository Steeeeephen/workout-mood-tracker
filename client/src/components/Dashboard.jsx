import React, {useEffect, useState, useTransition} from 'react'
import {useAuth} from "../context/AuthContext.jsx";
import WeeklyView from "./WeeklyView.jsx";
import axios from "axios";
import api from "../config/api.js";

const Dashboard = () => {

    const { user, loading } = useAuth();

    const [ entries, setEntries ] = useState([]);


    useEffect(() => {
        // Setting page title
        if (user?.first_name){
            document.title = `${user?.first_name}'s Dashboard`;
        } else {
            document.title = 'Dashboard';
        }
    }, [user]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/entries', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEntries(response.data);
            } catch (err){
                console.error(err);
            }
        }

        fetchEntries()

    }, []);



    return (
        <div className="w-3/5 m-auto">
            <title>{user?.first_name}'s Dashboard</title>
            <h1 className="text-3xl">Welcome, {user?.first_name}</h1>
            <WeeklyView />
        </div>

    )
}
export default Dashboard
