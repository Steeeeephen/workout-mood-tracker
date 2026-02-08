import React, {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import axios from "axios";

const EntryModal = ({ entry, onClose, onSuccess }) => {

    const [formData, setFormData] = useState({
        entry_datetime: entry?.entry_datetime
            ? format(new Date(entry.entry_datetime), "yyyy-MM-dd'T'HH:mm")
            : '',
        entry_type: entry?.entry_type || '',
        mood: entry?.mood.toString() || '',
        content: entry?.content || ''
    })

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


            if (entry){
                await axios.patch(`http://localhost:3000/api/entries/${entry.id}/update`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                // CREATE new entry
                await axios.post('http://localhost:3000/api/entries', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            onSuccess();


        } catch (err) {
            console.error(err)
        }

    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">

                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4">New Entry</h2>
                    <button
                        onClick={onClose}
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
                            <option value="WORKOUT">Workout</option>
                            <option value="POST_WORKOUT">Post Workout</option>
                            <option value="MISC">Misc</option>
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
                                    checked={formData.mood === '5'}
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
    )
}
export default EntryModal
