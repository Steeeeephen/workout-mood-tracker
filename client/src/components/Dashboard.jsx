import React, {useEffect, useState, useTransition} from 'react'
import {useAuth} from "../context/AuthContext.jsx";
import WeeklyView from "./WeeklyView.jsx";
import axios from "axios";
import {parse, parseISO} from "date-fns";
import api from "../config/api.js";

const Dashboard = () => {

    const { user, loading } = useAuth();

    const [ entries, setEntries ] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        entry_datetime: '',
        entry_type: '',
        mood: '',
        content: ''
    })


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


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // Get the user token
            const token = localStorage.getItem('token');

            const payload = {
                entry_datetime: parseISO(formData.entry_datetime),
                entry_type: formData.entry_type,
                mood: parseInt(formData.mood),
                content: formData.content
            };

            await axios.post('http://localhost:3000/api/entries', payload, {
                headers: {'Authorization': `Bearer ${token}`}
            })

            setIsModalOpen(false);


        } catch (err) {
            console.error(err)
        }

    }



    return (
        <div className="w-3/5 m-auto">

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">

                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold mb-4">New Entry</h2>
                            <button
                                onClick={()=>setIsModalOpen(false)}
                                className=""
                            >CLOSE
                            </button>
                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="flex justify-between">
                                <input
                                    type="datetime-local"
                                    value={formData.entry_datetime}
                                    onChange={(e)=>setFormData({...formData, entry_datetime: e.target.value})}
                                />

                                <select
                                    name="entryType" id="entryType"
                                    value={formData.entry_type}
                                    onChange={(e)=>setFormData({...formData, entry_type: e.target.value})}
                                >
                                    <option value="" selected disabled>Entry Type</option>
                                    <option value="PRE_WORKOUT">Pre Workout</option>
                                    <option value="workout">Workout</option>
                                    <option value="POST_WORKOUT">Post Workout</option>
                                    <option value="misc">Misc</option>
                                </select>
                            </div>

                            <div>
                                <fieldset className="flex border p-2 rounded">
                                    <legend>Mood Rating</legend>

                                    <div className="mr-4">
                                        <input
                                            type="radio"
                                            id="1"
                                            name="mood"
                                            value="1"
                                            checked={formData.mood === '1'}
                                            onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                                        />
                                        <label htmlFor="1">1</label>
                                    </div>

                                    <div className="mr-4">
                                        <input
                                            type="radio"
                                            id="2"
                                            name="mood"
                                            value="2"
                                            checked={formData.mood === '2'}
                                            onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                                        />
                                        <label htmlFor="2">2</label>
                                    </div>

                                    <div className="mr-4">
                                        <input
                                            type="radio"
                                            id="3"
                                            name="mood"
                                            value="3"
                                            checked={formData.mood === '3'}
                                            onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                                        />
                                        <label htmlFor="3">3</label>
                                    </div>

                                    <div className="mr-4">
                                        <input
                                            type="radio"
                                            id="4"
                                            name="mood"
                                            value="4"
                                            checked={formData.mood === '4'}
                                            onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                                        />
                                        <label htmlFor="4">4</label>
                                    </div>

                                    <div className="mr-4">
                                        <input
                                            type="radio"
                                            id="5"
                                            name="mood"
                                            value="5"
                                            checked={formData.mood === '3'}
                                            onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                                        />
                                        <label htmlFor="5">5</label>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="bg-amber-200 p-3 rounded-2xl">
                                <label htmlFor="content">Notes</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e)=>setFormData({...formData, content: e.target.value})}
                                    name="content"
                                    id="content"
                                    cols="35"
                                    rows="10"
                                />
                            </div>
                            <button className="cursor-pointer" type="submit">Submit</button>
                        </form>
                    </div>
                </div>

            )}

            <title>{user?.first_name}'s Dashboard</title>
            <h1 className="text-3xl">Welcome, {user?.first_name}</h1>
            <WeeklyView entries={entries}/>

            <div className="flex flex-row-reverse">
                <button
                    className="bg-green-400 rounded cursor-pointer p-3"
                    onClick={()=>setIsModalOpen(true)}
                >Create Entry
                </button>
            </div>
        </div>

    )
}
export default Dashboard
