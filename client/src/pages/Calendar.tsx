import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import WeeklyView from '../components/WeeklyView.js';
import api from '../config/api.js';
import MobileMonthlyView from '../components/MobileMonthlyView.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { Entry } from '../types/types.ts';

const Calendar = () => {
  const { user } = useAuth();

  const [entries, setEntries] = useState<Entry[]>([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [setEditingEntry] = useState(false);
  const isMobile = useIsMobile();

  // const handleSuccess = () => {
  //   setIsModalOpen(false);
  //   setEditingEntry(null);
  //   fetchEntries();
  // };

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
    <div className="w-full mx-auto md:w-10/12 md:m-auto grow">
      {/*{isModalOpen && (*/}
      {/*  <EntryModal*/}
      {/*    entry={null}*/}
      {/*    onClose={() => setIsModalOpen(false)}*/}
      {/*    onSuccess={handleSuccess}*/}
      {/*  />*/}
      {/*)}*/}
      {isMobile ? (
        <MobileMonthlyView entries={entries} fetchEntries={fetchEntries} />
      ) : (
        <WeeklyView entries={entries} fetchEntries={fetchEntries} />
      )}
    </div>
  );
};
export default Calendar;
