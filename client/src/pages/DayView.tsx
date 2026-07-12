import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import EntryModal from '../components/EntryModal';
import DeleteEntryModal from '../components/DeleteEntryModal';

import { Entry } from '../types/types.ts';
import { useFetchEntries } from '../context/FetchEntriesContext.tsx';

const DayView = () => {
  useEffect(() => {
    document.title = `${format(parseISO(date ?? ''), 'EEEE, MMMM d, yyyy')} - Workout Mood Tracker`;
  }, []);

  const { entries, isLoading, fetchEntries } = useFetchEntries();
  const { date } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true); // Show the modal
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);

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

  const dayEntries = useMemo(() => {
    return entries
      .filter((entry: Entry) => {
        const entryDate = format(new Date(entry.entry_datetime), 'yyyy-MM-dd');
        return entryDate === date;
      })
      .sort((a: Entry, b: Entry) => {
        return (
          new Date(a.entry_datetime).getTime() -
          new Date(b.entry_datetime).getTime()
        );
      });
  }, [entries, date]);

  return (
    <div className="flex-1 p-6">
      {isModalOpen && (
        <EntryModal
          entry={editingEntry}
          defaultDate={date ?? ''}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteEntryModal
          entry={deletingEntry!}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingEntry(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      <div className="max-w-4xl mx-auto flex flex-col">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          {format(parseISO(date ?? ''), 'EEEE, MMMM d, yyyy')}
        </h1>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            ← Back to Calendar
          </button>

          <button
            className=" px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create Entry
          </button>
        </div>

        {isLoading ? (
          <div>Loading entries...</div>
        ) : dayEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No entries for this day</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col items-start gap-2 md:flex-row md:gap-4"
              >
                {/* Time */}
                <div className="w-20 text-right font-semibold text-gray-600 pt-1">
                  {format(new Date(entry.entry_datetime), 'h:mm a')}
                </div>

                {/* Timeline connector */}
                <div className="hidden flex-col items-center md:flex">
                  <div className="w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow"></div>
                  <div className="w-0.5 h-full bg-gray-300 -mt-1"></div>
                </div>

                {/* Entry card */}
                <div
                  className={`flex-1 border-2 p-4 rounded-lg shadow-sm w-full ${moodColors[entry.mood]}`}
                >
                  <div className="flex flex-row justify-between items-start mb-2">
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
  );
};
export default DayView;
