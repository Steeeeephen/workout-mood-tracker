import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import WeeklyView from '../components/WeeklyView.js';
import MobileMonthlyView from '../components/MobileMonthlyView.js';
import useIsMobile from '../hooks/useIsMobile.js';

const Calendar = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.first_name) {
      document.title = `${user?.first_name}'s Calendar`;
    } else {
      document.title = 'Calendar';
    }
  }, [user]);

  return (
    <div className="w-full mx-auto md:w-10/12 md:m-auto grow">
      {isMobile ? <MobileMonthlyView /> : <WeeklyView />}
    </div>
  );
};
export default Calendar;
