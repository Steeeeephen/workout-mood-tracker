import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNotification } from '../context/NotificationContext.jsx';
import api from '../config/api.js';
import EntryModal from '../components/EntryModal.jsx';
import DeleteEntryModal from '../components/DeleteEntryModal.jsx';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const { showError } = useNotification();
  const todayDate = new Date();
  const formattedTodayDate = format(todayDate, 'EEEE, MMMM d, yyyy'); // "Thursday, February 13, 2025"
  const todayDateString = format(todayDate, 'yyyy-MM-dd'); // "2025-02-13"

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Delete modal state management
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(null);

  // 'handleEdit' is used to open the edit entry modal. It is wired to the 'Edit' button rendered to each entry in the 'entries' array.
  const handleEdit = (entry) => {
    setEditingEntry(entry); // Store the clicked entry's data
    setIsModalOpen(true); // Show the modal
  };

  const handleDelete = (entry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingEntry(null); // Clear the editing state
    fetchTodaysEntries(); // Refresh to show updated entry
  };

  // Color coding based on mood rating (1-5)
  const moodColors = {
    1: 'bg-red-200 border-red-300', // Worst mood.
    2: 'bg-orange-200 border-orange-300',
    3: 'bg-yellow-200 border-yellow-300',
    4: 'bg-lime-200 border-lime-300',
    5: 'bg-green-200 border-green-300', // Best mood.
  };

  const fetchTodaysEntries = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/entries', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todaysEntries = response.data.filter((entry) => {
        const entryDate = entry.entry_datetime.split('T')[0];
        return entryDate === todayDateString;
      });

      // Sort by time
      todaysEntries.sort(
        (a, b) => new Date(a.entry_datetime) - new Date(b.entry_datetime),
      );
      setEntries(todaysEntries);
    } catch (err) {
      console.error(err);
      showError('Failed to load entries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysEntries();
  }, []);

  return (
    <div className="grow">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between">
            <h1 className="text-4xl md:text-5xl font-bold ">
              {formattedTodayDate}
            </h1>

            <button
              className="bg-green-400 rounded cursor-pointer p-3"
              onClick={() => setIsModalOpen(true)}
            >
              Create Entry
            </button>
          </div>
        </div>

        <div className="bg-slate-800/25 backdrop-blur rounded-xl p-6">
          <h2 className="text-2xl font-bold  mb-4">Today's Activities</h2>
          {/* Entries list will go here */}
          {isLoading ? (
            <div>Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No entries for this day</p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
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
                  <div
                    className={`flex-1 border-2 p-4 rounded-lg shadow-sm ${moodColors[entry.mood]}`}
                  >
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
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - only renders when isEditModalOpen is true */}
      {isModalOpen && (
        <EntryModal
          entry={editingEntry} // Pass the entry data to pre-fill the form
          defaultDate={todayDateString}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null); // Clear state when closing
          }}
          onSuccess={handleSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteEntryModal
          entry={deletingEntry}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingEntry(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
export default Dashboard;
