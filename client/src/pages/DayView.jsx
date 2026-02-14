import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {format, parseISO} from 'date-fns';
import EntryModal from "../components/EntryModal.jsx";
import DeleteEntryModal from "../components/DeleteEntryModal.jsx";

const DayView = () => {

    const { showError } = useError();

    const { date }= useParams(); // The date comes from the url parameters...
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]); // This day's entries are saved to an array called 'entries' this is done via the 'fetchDayEntries' function below.


    // Edit modal State Management
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    // 'handleEdit' is used to open the edit entry modal. It is wired to the 'Edit' button rendered to each entry in the 'entries' array.
    const handleEdit = (entry) => {
        setEditingEntry(entry); // Store the clicked entry's data
        setIsEditModalOpen(true); // Show the modal
        console.log(entry)
    };


    // Delete modal state management
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingEntry, setDeletingEntry] = useState(null)

    const handleDelete = (entry) => {
        setDeletingEntry(entry)
        setIsDeleteModalOpen(true);
    }





    // Color coding based on mood rating (1-5)
    const moodColors = {
        1: 'bg-red-200 border-red-300', // Worst mood.
        2: 'bg-orange-200 border-orange-300',
        3: 'bg-yellow-200 border-yellow-300',
        4: 'bg-lime-200 border-lime-300',
        5: 'bg-green-200 border-green-300' // Best mood.
    }


    // Fetch entries for the selected day.
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
                showError('Failed to load entries. Please try again.');
            }
        }

    // Fetch entries when component mounts or date changes
    useEffect(() => {
        fetchDayEntries();
    }, [date]);

    // Called after successful edit - closes modal and refreshes entries
    const handleSuccess = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false)
        setEditingEntry(null); // Clear the editing state
        fetchDayEntries() // Refresh to show updated entry
    }




    return (
        <div className="flex-1 p-6">
            {/* Edit Modal - only renders when isEditModalOpen is true */}
            {isEditModalOpen && (
                <EntryModal
                    entry={editingEntry} // Pass the entry data to pre-fill the form
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setEditingEntry(null); // Clear state when closing
                    }}
                    onSuccess={handleSuccess}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteEntryModal
                    entry={deletingEntry}
                    onClose = {()=>{
                        setIsDeleteModalOpen(false)
                        setDeletingEntry(null);
                    }}
                    onSuccess={handleSuccess}
                />
            )}


            <div className="max-w-4xl mx-auto">
                {/* Header with back button and date */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                    >
                        ← Back to Calendar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                    </h1>
                </div>

                {/* Entries timeline */}
                {entries.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No entries for this day</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {entries.map(entry => (
                            <div key={entry.id} className="flex items-start gap-4">
                                {/* Time */}
                                <div className="w-20 text-right text-sm font-semibold text-gray-600 pt-1">
                                    {format(new Date(entry.entry_datetime), 'h:mm a')}
                                </div>

                                {/* Timeline connector */}
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow"></div>
                                    <div className="w-0.5 h-full bg-gray-300 -mt-1"></div>
                                </div>

                                {/* Entry card */}
                                <div className={`flex-1 border-2 p-4 rounded-lg shadow-sm ${moodColors[entry.mood]}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{entry.entry_type}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entry)}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {entry.mood && (
                                        <div className="text-sm font-semibold mb-2">
                                            Mood: {entry.mood}/5
                                        </div>
                                    )}
                                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default DayView


