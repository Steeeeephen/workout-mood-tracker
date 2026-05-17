import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isToday,
} from 'date-fns';
import EntryModal from './EntryModal.js';

const MobileMonthlyView = ({ entries, fetchEntries }) => {
  // I'm going to be reusing a good amount of code from WeeklyView to get the mobile calendar
  // working. This is important to come back to later and possibly create a custom hook.

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    fetchEntries();
  };

  const handleCellClick = (date) => {
    // const dateStr = date.toISOString().split('T')[0];
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/day/${dateStr}`);
  };

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);
  const emptyCells = Array.from({ length: startPadding });
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Entries will be color coded depending on mood. This gives users an easy way to identify before clicking on a day cell for more details.
  const moodColors = {
    1: 'bg-red-600',
    2: 'bg-orange-300',
    3: 'bg-yellow-300',
    4: 'bg-lime-300',
    5: 'bg-green-600',
  };

  const renderCells = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    return entries
      .filter((entry) => {
        const entryDate = format(new Date(entry.entry_datetime), 'yyyy-MM-dd');
        return entryDate === dateStr;
      })
      .slice(0, 3);
  };

  return (
    <>
      {isModalOpen && (
        <EntryModal
          entry={null}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Calendar Navigation */}
      <div className="flex flex-col justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          className="bg-green-400 rounded cursor-pointer p-3 w-full mt-3"
          onClick={() => setIsModalOpen(true)}
        >
          Create Entry
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7">
        {dayHeaders.map((day) => (
          <div className="flex flex-col items-center " key={day}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((date) => {
          const dayEntries = renderCells(date);

          return (
            <div
              className="flex flex-col items-center "
              style={{ height: '64px' }}
              key={format(date, 'yyyy-MM-dd')}
              onClick={() => handleCellClick(date)}
            >
              <span>{format(date, 'd')}</span>
              <div className="flex flex-col gap-0.5 w-full px-0.5 mt-1">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`h-1.5 rounded-sm ${moodColors[entry.mood]}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MobileMonthlyView;
