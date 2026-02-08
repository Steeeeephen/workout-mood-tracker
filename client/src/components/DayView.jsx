import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {format, parseISO} from 'date-fns';
import EntryModal from "./EntryModal.jsx";

const DayView = () => {
    const { date }= useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    const handleEdit = (entry) => {
        setEditingEntry(entry);  // ← NOW editingEntry gets the object
        setIsModalOpen(true);
        console.log(entry)
    };




    const moodColors = {
        1: 'bg-red-200 border-red-300',
        2: 'bg-orange-200 border-orange-300',
        3: 'bg-yellow-200 border-yellow-300',
        4: 'bg-lime-200 border-lime-300',
        5: 'bg-green-200 border-green-300'
    }


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

    useEffect(() => {
        fetchDayEntries();
    }, [date]);

    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingEntry(null);
        fetchDayEntries()
    }




    return (
        <>

            {isModalOpen && (
                // <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                //     <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                //
                //         <div className="flex justify-between">
                //             <h2 className="text-xl font-bold mb-4">New Entry</h2>
                //             <button
                //                 onClick={()=>setIsModalOpen(false)}
                //                 className=""
                //             >CLOSE
                //             </button>
                //         </div>
                //
                //
                //         <form onSubmit={handleSubmit}>
                //
                //             <div className="flex justify-between">
                //                 <input
                //                     type="datetime-local"
                //                     value={formData.entry_datetime}
                //                     onChange={(e)=>setFormData({...formData, entry_datetime: e.target.value})}
                //                 />
                //
                //                 <select
                //                     name="entryType" id="entryType"
                //                     value={formData.entry_type}
                //                     onChange={(e)=>setFormData({...formData, entry_type: e.target.value})}
                //                 >
                //                     <option value="" selected disabled>Entry Type</option>
                //                     <option value="PRE_WORKOUT">Pre Workout</option>
                //                     <option value="WORKOUT">Workout</option>
                //                     <option value="POST_WORKOUT">Post Workout</option>
                //                     <option value="MISC">Misc</option>
                //                 </select>
                //             </div>
                //
                //             <div>
                //                 <fieldset className="flex border p-2 rounded">
                //                     <legend>Mood Rating</legend>
                //
                //                     <div className="mr-4">
                //                         <input
                //                             type="radio"
                //                             id="1"
                //                             name="mood"
                //                             value="1"
                //                             checked={formData.mood === '1'}
                //                             onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                //                         />
                //                         <label htmlFor="1">1</label>
                //                     </div>
                //
                //                     <div className="mr-4">
                //                         <input
                //                             type="radio"
                //                             id="2"
                //                             name="mood"
                //                             value="2"
                //                             checked={formData.mood === '2'}
                //                             onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                //                         />
                //                         <label htmlFor="2">2</label>
                //                     </div>
                //
                //                     <div className="mr-4">
                //                         <input
                //                             type="radio"
                //                             id="3"
                //                             name="mood"
                //                             value="3"
                //                             checked={formData.mood === '3'}
                //                             onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                //                         />
                //                         <label htmlFor="3">3</label>
                //                     </div>
                //
                //                     <div className="mr-4">
                //                         <input
                //                             type="radio"
                //                             id="4"
                //                             name="mood"
                //                             value="4"
                //                             checked={formData.mood === '4'}
                //                             onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                //                         />
                //                         <label htmlFor="4">4</label>
                //                     </div>
                //
                //                     <div className="mr-4">
                //                         <input
                //                             type="radio"
                //                             id="5"
                //                             name="mood"
                //                             value="5"
                //                             checked={formData.mood === '3'}
                //                             onChange={(e)=>setFormData({...formData, mood: e.target.value})}
                //                         />
                //                         <label htmlFor="5">5</label>
                //                     </div>
                //                 </fieldset>
                //             </div>
                //
                //             <div className="bg-amber-200 p-3 rounded-2xl">
                //                 <label htmlFor="content">Notes</label>
                //                 <textarea
                //                     value={formData.content}
                //                     onChange={(e)=>setFormData({...formData, content: e.target.value})}
                //                     name="content"
                //                     id="content"
                //                     cols="35"
                //                     rows="10"
                //                 />
                //             </div>
                //             <button className="cursor-pointer" type="submit">Submit</button>
                //         </form>
                //     </div>
                // </div>

                <EntryModal
                    entry={editingEntry}
                    onClose={() => {
                        setIsModalOpen(false)
                        setEditingEntry(null);
                }}
                    onSuccess={handleSuccess}
                />

            )}


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
                                    <div className="font-semibold flex justify-between">
                                        {entry.entry_type}
                                        <div className="flex gap-4">
                                            <button onClick={()=>handleEdit(entry)} className="cursor-pointer bg-blue-600 text-zinc-100 rounded py-1 px-2">Edit</button>
                                            <button className="cursor-pointer bg-red-600 text-zinc-100 rounded py-1 px-2">Delete</button>
                                        </div>
                                    </div>
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


