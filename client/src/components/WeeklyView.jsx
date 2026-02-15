// @ts-nocheck
// noinspection JSValidateTypes

import {Fragment} from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { isToday } from 'date-fns';

const WeeklyView = ({entries}) => {

    const today = new Date().toISOString().split('T')[0];

    const [weekOffset, setWeekOffset] = useState(0);

    const navigate = useNavigate();

    const handleCellClick = (date, timeBlock) => {
        const dateStr = date.toISOString().split('T')[0];
        console.log(dateStr)
        navigate(`/day/${dateStr}`)
    }

    const currentWeekStart = startOfWeek(
        addDays(new Date(), weekOffset * 7),
        { weekStartsOn: 1 }
    );

    const weekDays = Array.from({length: 7}, (_, i) =>
        addDays(currentWeekStart, i)
    );

    const timeBlocks = [
        { label: '12am - 4am', startHour: 0 },
        { label: '4am - 8am', startHour: 4 },
        { label: '8am - 12pm', startHour: 8 },
        { label: '12pm - 4pm', startHour: 12 },
        { label: '4pm - 8pm', startHour: 16 },
        { label: '8pm - 12am', startHour: 20 }
    ];

    const moodColors = {
        1: 'bg-red-100 border-red-400 text-red-800',
        2: 'bg-orange-100 border-orange-400 text-orange-800',
        3: 'bg-yellow-100 border-yellow-400 text-yellow-800',
        4: 'bg-lime-100 border-lime-400 text-lime-800',
        5: 'bg-green-100 border-green-400 text-green-800'
    }

    const renderCell = (date, timeBlock) => {
        const dateStr = date.toISOString().split('T')[0];

        const cellEntries = entries.filter(entry => {
            const entryDate = entry.entry_datetime.split('T')[0];
            const entryHour = new Date(entry.entry_datetime).getHours();

            const matchesDate = entryDate === dateStr;
            const matchesTime = entryHour >= timeBlock.startHour &&
                entryHour < timeBlock.startHour + 4;

            return matchesDate && matchesTime;
        });

        return cellEntries.map(entry => (
            <div
                key={entry.id}
                className={`text-xs p-2 rounded-md mb-1 border font-medium ${moodColors[entry.mood]}`}>
                {entry.entry_type}
            </div>
        ));

    }

    const previousWeek = () => setWeekOffset(weekOffset - 1);
    const nextWeek = () => setWeekOffset(weekOffset + 1);
    const currentWeek = () => setWeekOffset(0);



    return (
        <div className="max-w-7xl mx-auto p-6">

            {/* Control Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Week of {format(currentWeekStart, 'MMMM d, yyyy')}
                </h2>

                {/*<button*/}
                {/*    className="bg-green-400 rounded cursor-pointer p-3 mt-3"*/}
                {/*    onClick={()=>setIsModalOpen(true)}*/}
                {/*>Create Entry*/}
                {/*</button>*/}


                <div className="flex gap-2">
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


            {/* Calendar Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-8">

                    {/* Empty corner cell */}
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 border-b border-r border-gray-200"></div>

                    {/* Day headers */}
                    {weekDays.map((date)=>{
                        return (
                            <div
                                key={date.toISOString()}
                                className={`p-4 text-center border-b border-r border-gray-200 last:border-r-0 ${
                                    isToday(date)
                                        ? 'bg-linear-to-br from-teal-500 to-emerald-500 text-white font-bold'
                                        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 font-semibold'
                                }`}
                            >
                                <div className="text-sm uppercase tracking-wide">{format(date, 'EEE')}</div>
                                <div className={`text-lg font-bold mt-1 ${isToday(date) ? 'text-white' : 'text-gray-800'}`}>
                                    {format(date, 'd')}
                                </div>
                            </div>
                        );
                    })}

                    {/* Time blocks and cells */}
                    { timeBlocks.map((timeBlock)=>
                        <Fragment key={timeBlock.label}>
                            {/* Time label */}
                            <div
                                className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 text-xs text-gray-600 font-semibold flex items-center justify-end pr-4 border-b border-r border-gray-200 uppercase tracking-wide"
                            >
                                {timeBlock.label}
                            </div>

                            {/* Day cells */}
                            {weekDays.map((date, dayIndex)=>
                                <div
                                    key={`${date}-${timeBlock.startHour}`}
                                    data-day={dayIndex}
                                    data-hour={timeBlock.startHour}
                                    className="bg-white p-3 min-h-24 hover:bg-teal-50 cursor-pointer transition-all border-b border-r border-gray-200 last:border-r-0"
                                    onClick={()=> handleCellClick(date, timeBlock)}
                                >
                                    {renderCell(date, timeBlock)}
                                </div>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>

        </div>
    )
}
export default WeeklyView

