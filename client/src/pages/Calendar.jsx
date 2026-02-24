import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import WeeklyView from '../components/WeeklyView.jsx';
import api from '../config/api.js';
import EntryModal from '../components/EntryModal.jsx';

const Calendar = () => {
  const { user, loading } = useAuth();

  const [entries, setEntries] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    fetchEntries();
  };

  useEffect(() => {
    // Setting page title
    if (user?.first_name) {
      document.title = `${user?.first_name}'s Calendar`;
    } else {
      document.title = 'Calendar';
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/entries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  return (
    <div className="w-10/12 m-auto">
      {isModalOpen && (
        <EntryModal
          entry={null}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      <title>{user?.first_name}'s Dashboard</title>
      {/*<h1 className="text-3xl font-bold">Hi, {user?.first_name}</h1>*/}
      <WeeklyView entries={entries} />

      <div className="flex flex-row-reverse">
        <button
          className="bg-green-400 rounded cursor-pointer p-3 mt-3"
          onClick={() => setIsModalOpen(true)}
        >
          Create Entry
        </button>
      </div>
    </div>
  );
};
export default Calendar;
