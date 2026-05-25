import React, { Fragment } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isToday } from 'date-fns';
import EntryModal from './EntryModal.js';
import { useFetchEntries } from '../context/FetchEntriesContext.tsx';

const WeeklyView = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchEntries, entries } = useFetchEntries();

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchEntries();
  };

  const handleCellClick = (date: Date) => {
    // const dateStr = date.toISOString().split('T')[0];
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/day/${dateStr}`);
  };

  const currentWeekStart = startOfWeek(addDays(new Date(), weekOffset * 7), {
    weekStartsOn: 1,
  });

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i),
  );

  interface TimeBlock {
    label: string;
    startHour: number;
  }

  // The choice is a bit arbitrary, but for now time will be divided into four-hour blocks.
  // Future versions could be converted to hourly blocks but in the early stages of a portfolio project this seems appropriate.
  const timeBlocks = [
    { label: '12am - 4am', startHour: 0 },
    { label: '4am - 8am', startHour: 4 },
    { label: '8am - 12pm', startHour: 8 },
    { label: '12pm - 4pm', startHour: 12 },
    { label: '4pm - 8pm', startHour: 16 },
    { label: '8pm - 12am', startHour: 20 },
  ];

  // Entries will be color coded depending on mood. This gives users an easy way to identify before clicking on a day cell for more details.
  const moodColors = [
    '',
    'bg-red-200 border-red-300', // Worst mood.
    'bg-orange-200 border-orange-300',
    'bg-yellow-200 border-yellow-300',
    'bg-lime-200 border-lime-300',
    'bg-green-200 border-green-300', // Best mood.
  ];

  // The renderCell function is a helper function for the logic of conditionally
  // rendering mood entries to the correct date and time block of the weekly calendar view.
  // renderCell accepts two arguments, 'date' and 'timeBlock'.
  const renderCell = (date: Date, timeBlock: TimeBlock) => {
    // The date for this specific cell is passed and converted in a such a way to be easily compared to dates from db entries.
    const dateStr = format(date, 'yyyy-MM-dd');

    // Here a new array is returned from the 'entries' prop using the filter method.
    const cellEntries = entries.filter((entry) => {
      // formatting the 'datetime' property of each entry (this is the user defined date, NOT created_at)
      // entryDate is formatted to be compared to dateStr
      const entryDate = format(entry.entry_datetime, 'yyyy-MM-dd');
      // entryHour is formatted to be compared to the current timeBlock.
      const entryHour = new Date(entry.entry_datetime).getHours();

      // Finally, each entry is compared to the current cell block to determine if it should be rendered
      const matchesDate = entryDate === dateStr; // Comparing the entry date to the cell date.
      const matchesTime =
        entryHour >= timeBlock.startHour && entryHour < timeBlock.startHour + 4; // Determining if the entry falls within the time block.

      return matchesDate && matchesTime; // Finally, the entry is added to the cellEntries array if both conditions evaluate 'true'.
    });

    return cellEntries.map((entry) => (
      <div
        key={entry.id}
        className={`text-xs p-2 rounded-md mb-1 border font-medium ${moodColors[entry.mood]}`}
      >
        {entry.entry_type}
      </div>
    ));
  };

  const previousWeek = () => setWeekOffset(weekOffset - 1);
  const nextWeek = () => setWeekOffset(weekOffset + 1);
  const currentWeek = () => setWeekOffset(0);

  return (
    <>
      {isModalOpen && (
        <EntryModal
          entry={null}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Control Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Week of {format(currentWeekStart, 'MMMM d, yyyy')}
          </h2>

          <div className="flex gap-2">
            <button
              className="bg-green-400 rounded-lg cursor-pointer px-4 py-2"
              onClick={() => setIsModalOpen(true)}
            >
              Create Entry
            </button>

            <button
              onClick={previousWeek}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              ← Previous
            </button>
            <button
              onClick={currentWeek}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Today
            </button>
            <button
              onClick={nextWeek}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Next →
            </button>
          </div>
        </div>

        {/*The Calendar is rendered using grid and represents one week*/}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="grid grid-cols-8">
            {/* Empty corner cell */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 border-b border-r border-gray-200"></div>

            {/* Day headers */}
            {weekDays.map((date) => {
              return (
                <div
                  key={date.toISOString()}
                  className={`p-4 text-center border-b border-r border-gray-200 last:border-r-0 ${
                    isToday(date)
                      ? 'bg-linear-to-br from-teal-500 to-emerald-500 text-white font-bold'
                      : 'bg-linear-to-br from-gray-50 to-gray-100 text-gray-700 font-semibold'
                  }`}
                >
                  <div className="text-sm uppercase tracking-wide">
                    {format(date, 'EEE')}
                  </div>
                  <div
                    className={`text-lg font-bold mt-1 ${isToday(date) ? 'text-white' : 'text-gray-800'}`}
                  >
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}

            {/*Time blocks and cells */}
            {timeBlocks.map((timeBlock) => (
              <Fragment key={timeBlock.label}>
                {/* Time label */}
                <div className="bg-linear-to-r from-gray-50 to-gray-100 p-3 text-xs text-gray-600 font-semibold flex items-center justify-end pr-4 border-b border-r border-gray-200 uppercase tracking-wide">
                  {timeBlock.label}
                </div>

                {/* Day cells */}
                {weekDays.map((date, dayIndex) => (
                  <div
                    key={`${date}-${timeBlock.startHour}`}
                    data-day={dayIndex}
                    data-hour={timeBlock.startHour}
                    className="bg-white p-3 h-24 hover:bg-teal-50 cursor-pointer transition-all border-b border-r border-gray-200 last:border-r-0  overflow-auto"
                    onClick={() => handleCellClick(date)}
                  >
                    {renderCell(date, timeBlock)}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default WeeklyView;
