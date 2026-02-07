import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {format, parseISO} from 'date-fns';

const DayView = () => {
    const { date }= useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);


    const moodColors = {
        1: 'bg-red-200 border-red-300',
        2: 'bg-orange-200 border-orange-300',
        3: 'bg-yellow-200 border-yellow-300',
        4: 'bg-lime-200 border-lime-300',
        5: 'bg-green-200 border-green-300'
    }


    useEffect(()=>{
        const fetchDayEntries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/entries', {
                    headers: { 'Authorization': `Bearer: ${token}` }

                });


                // Filter by the date
                const dayEntries = response.data.filter(entry => {
                    const entryDate = entry.entry_datetime.split('T')[0];
                    return entryDate === date;
                });

                // Sort by time
                dayEntries.sort((a, b) =>
                    new Date(a.entry_datetime) - new Date(b.entry_datetime)
                );

                setEntries(dayEntries);
            } catch (err) {
                console.error('Error fetching entries:', err);
            }

        }

        fetchDayEntries();
    }, [date])




    return (
        <>
            <div className="w-3/4 m-auto">
                <button onClick={() => navigate(-1)} className="my-4">
                    ← Back to Calendar
                </button>
            </div>

                { entries.length === 0 ? (
                    <p>No entries for this day</p>
                    ) : (
                    <div className="max-w-3xl mx-auto">
                        {entries.map(entry => (
                            <div key={entry.id} className="flex items-center gap-4 my-6">
                                <div className="w-24 text-right">{format(new Date(entry.entry_datetime), 'h:mm a')}</div>
                                <div className="w-12 border-t-2 border-gray-400"></div>
                                <div className={`flex-1 border p-4 rounded shadow ${moodColors[entry.mood]} `}>
                                    <div className="font-semibold">{entry.entry_type}</div>
                                    {entry.mood && <div>Mood: {entry.mood}/5</div>}
                                    <p className="mt-2">{entry.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )

                }
        </>
    )
}
export default DayView


