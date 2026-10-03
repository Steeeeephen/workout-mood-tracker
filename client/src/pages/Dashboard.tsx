import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import EntryModal from '../components/EntryModal.js';
import DeleteEntryModal from '../components/DeleteEntryModal.js';
import { Entry } from '../types/types';
import { useFetchEntries } from '../context/FetchEntriesContext.tsx';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Today at a glance - Workout Mood Tracker';
  }, []);

  const { entries, isLoading, fetchEntries } = useFetchEntries();

  const todayDate = new Date();
  const todayDateString = format(todayDate, 'yyyy-MM-dd'); // "2025-02-13"
  const formattedTodayDate = format(todayDate, 'EEEE, MMMM d, yyyy'); // "Thursday, February 13, 2025"

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (entry: Entry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingEntry(null);
    fetchEntries();
  };

  const moodColors = [
    '',
    'bg-red-200 border-red-300', // Worst mood.
    'bg-orange-200 border-orange-300',
    'bg-yellow-200 border-yellow-300',
    'bg-lime-200 border-lime-300',
    'bg-green-200 border-green-300', // Best mood.
  ];

  const todaysEntries = useMemo(() => {
    return entries
      .filter((entry: Entry) => {
        const entryDate = format(new Date(entry.entry_datetime), 'yyyy-MM-dd');
        return entryDate === todayDateString;
      })
      .sort((a: Entry, b: Entry) => {
        return (
          new Date(a.entry_datetime).getTime() -
          new Date(b.entry_datetime).getTime()
        );
      });
  }, [entries]);

  return (
    <div className="grow">
      <div className="max-w-6xl mx-auto border-2 border-gray-200 rounded-lg shadow-lg p-6 bg-white">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between items-center md:flex-row md:items-start">
            <h1 className="text-2xl font-bold md:text-5xl">
              Today's Activities
            </h1>

            <button
              className="bg-green-400 rounded mt-4 cursor-pointer p-3 w-full md:w-auto md:mt-0"
              onClick={() => setIsModalOpen(true)}
            >
              Create Entry
            </button>
          </div>
        </div>

        <div className="bg-slate-800/25 backdrop-blur rounded-xl p-6">
          <h2 className="text-2xl font-bold  mb-4"> {formattedTodayDate}</h2>
          {isLoading ? (
            <div>Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No entries for this day</p>
            </div>
          ) : (
            <div className="space-y-6">
              {todaysEntries.map((entry) => (
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

      {isModalOpen && (
        <EntryModal
          entry={editingEntry}
          defaultDate={todayDateString}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteEntryModal
          entry={deletingEntry!} // Leaving this here because this syntax is a little new to me. The '!' after the argument apparently tells TS 'This will definitely not be null'.
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
