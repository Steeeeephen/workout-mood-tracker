import { startOfWeek, addDays, format } from 'date-fns';

const WeeklyView = () => {
    // Starting on the current week, weekStartOn: 1 means we start on Monday.
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

    // Creating an array starting with currentWeekStart...
    // Starting with an empty array of 7 elements...
    // Each iteration takes currentWeekStart (1) then adds the index to fill out the whole week...
    // 1 + 0 = Monday, 1 + 1 = Tuesday, 1 + 2 = Wednesday, etc...
    const weekDays = Array.from({length: 7}, (_, i) =>
        addDays(currentWeekStart, i)
    );

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ,'Sunday']

    const timeBlocks = [
        { label: '12am - 4am', startHour: 0 },
        { label: '4am - 8am', startHour: 4 },
        { label: '8am - 12pm', startHour: 8 },
        { label: '12pm - 4pm', startHour: 12 },
        { label: '4pm - 8pm', startHour: 16 },
        { label: '8pm - 12am', startHour: 20 }
    ];


    return (
        <>
            <div className="grid grid-cols-8 gap-1 mt-10">

                <div className="bg-gray-100 p-2"></div>

                {weekDays.map((date)=>(
                    <div key={date.toISOString()} className="bg-gray-100 p-2 text-center">
                        <div>{format(date, 'EEE')} {/* Mon, Tue, Wed */}</div>
                        <div className="text-xs text-gray-600">
                            {format(date, 'M/d')} {/* 2/3, 2/4, etc */}
                        </div>
                    </div>
                ))}

                { timeBlocks.map((timeBlock)=>
                    <>
                        <div key={timeBlock.label} className="bg-gray-100 p-3 text-xs text-gray-700 font-medium flex items-center justify-end pr-3">
                            {timeBlock.label}
                        </div>

                        {days.map((day, dayIndex)=>
                            <div
                                key={`${day}-${timeBlock.startHour}`}
                                data-day={dayIndex}
                                data-hour={timeBlock.startHour}
                                className="bg-white p-3 min-h-20 hover:bg-blue-50 cursor-pointer transition-colors"
                            >

                            </div>
                        )}
                    </>
                )}
            </div>

        </>
    )
}
export default WeeklyView
