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

    // Calculate week start based on offset
    const currentWeekStart = startOfWeek(
        addDays(new Date(), weekOffset * 7), // Add/subtract weeks
        { weekStartsOn: 1 }
    );

    // Creating an array starting with currentWeekStart...
    // Starting with an empty array of 7 elements...
    // Each iteration takes currentWeekStart (1) then adds the index to fill out the whole week...
    // 1 + 0 = Monday, 1 + 1 = Tuesday, 1 + 2 = Wednesday, etc...
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

    // This is to conditionally color code entries based on the mood.
    const moodColors = {
        1: 'bg-red-200 border-red-300',
        2: 'bg-orange-200 border-orange-300',
        3: 'bg-yellow-200 border-yellow-300',
        4: 'bg-lime-200 border-lime-300',
        5: 'bg-green-200 border-green-300'
    }

    const renderCell = (date, timeBlock) => {
        const dateStr = date.toISOString().split('T')[0];

        const cellEntries = entries.filter(entry => {
            const entryDate = entry.entry_datetime.split('T')[0];
            const entryHour = new Date(entry.entry_datetime).getHours();

            console.log(`Entry: ${entry.entry_type}, Date: ${entryDate}, Hour: ${entryHour}`);

            const matchesDate = entryDate === dateStr;
            const matchesTime = entryHour >= timeBlock.startHour &&
                entryHour < timeBlock.startHour + 4;

            return matchesDate && matchesTime;
        });

        return cellEntries.map(entry => (
            <div
                key={entry.id}
                className={`text-xs p-1 rounded mb-1 ${moodColors[entry.mood]}`}>
                {entry.entry_type}
            </div>
        ));

    }

    // Week nav functions
    const previousWeek = () => setWeekOffset(weekOffset - 1);
    const nextWeek = () => setWeekOffset(weekOffset + 1);
    const currentWeek = () => setWeekOffset(0);



    return (
        <>

            {/* Control Bar */}

            <div className="flex flex-row-reverse">
                <div className="flex gap-2">
                    <button onClick={previousWeek}>← Previous Week</button>
                    <button onClick={currentWeek}>Today</button>
                    <button onClick={nextWeek}>Next Week →</button>
                </div>
            </div>


            <div className="grid grid-cols-8 gap-1 mt-10">


                <div className="bg-gray-100 p-2"></div>

                {weekDays.map((date)=>{
                    return (
                    <div
                        key={date.toISOString()}
                        className={`p-2 text-center ${ isToday(date) ? 'bg-blue-100 font-bold' : 'bg-gray-100 ' }`}
                    >
                        <div>{format(date, 'EEE')} {/* Mon, Tue, Wed */}</div>
                        <div className="text-xs text-gray-600">
                            {format(date, 'M/d')} {/* 2/3, 2/4, etc */}
                        </div>
                    </div>
                     );
                })}

                { timeBlocks.map((timeBlock)=>
                    <>
                        <div key={timeBlock.label} className="bg-gray-100 p-3 text-xs text-gray-700 font-medium flex items-center justify-end pr-3">
                            {timeBlock.label}
                        </div>

                        {weekDays.map((date, dayIndex)=>
                            <div
                                key={`${date}-${timeBlock.startHour}`}
                                data-day={dayIndex}
                                data-hour={timeBlock.startHour}
                                className="bg-white p-3 min-h-20 hover:bg-blue-50 cursor-pointer transition-colors"
                                onClick={()=> handleCellClick(date, timeBlock)}

                            >

                                {renderCell(date, timeBlock)}
                            </div>
                        )}
                    </>
                )}
            </div>

        </>
    )
}
export default WeeklyView
