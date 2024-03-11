import React, { useState, useEffect } from 'react';
import Stats from '../../atoms/stats/Stats';
import axios from 'axios';
import EventCount from '../CountUsers/EventCount'



function HomeAdmin() {
  const [userCount, setUserCount] = useState(0);
  const [previousCount, setEventsCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [registerUserCount, setRegisterUserCount] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Total Users
        const userResponse = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/usercount');
        const userData = await userResponse.json();
        setUserCount(userData.userCount);
        
        // Closing Events
        const ClosingeventResponse = await axios.get('https://api.schoolnutritionindustryprofessionals.com/api/closingeventscount');
        setEventsCount(ClosingeventResponse.data.eventsCount); 
        
        // Upcoming Events
        const UpcomingeventResponse = await axios.get('https://api.schoolnutritionindustryprofessionals.com/api/countupcomingevents');
        setEventCount(UpcomingeventResponse.data.eventsCount); 
        
        
        // Month Users
        const monthUserResponse = await axios.get('https://api.schoolnutritionindustryprofessionals.com/api/monthregisteruser');
        setRegisterUserCount(monthUserResponse.data.userCount);
        console.log('Moth data', monthUserResponse) 
        
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const statsBox = 'p-4 rounded-md stats-box-class text-white';

  return (
    <div>
      <div className="main-stats-boxes grid grid-cols-3 gap-4">
         <Stats
          mainstatsclass={statsBox}
          statstitleclass="stats-box-title"
          statstitle="All Users"
          statsitclass= 'flex items-center justify-between'
          statscontentclass="stats-content"
          statstextclass="stats-text"
          statsiconclass="stats-icon"
          statscount={`${userCount} Register Users`}
          statsiconhref="/images/rusers.png"
        />
        <Stats
          mainstatsclass={statsBox}
          statstitleclass="stats-box-title"
          statstitle="Month Register Users"
          statsitclass= 'flex items-center justify-between'
          statscontentclass="stats-content"
          statstextclass="stats-text"
          statsiconclass="stats-icon"
          statscount={registerUserCount.userCount}
          statsiconhref="/images/ausers.png"
        />
        <Stats
          mainstatsclass={statsBox}
          statstitleclass="stats-box-title"
          statstitle="Upcoming Events"
          statsitclass= 'flex items-center justify-between'
          statscontentclass="stats-content"
          statstextclass="stats-text"
          statsiconclass="stats-icon"
          statscount={eventCount}
          statsiconhref="/images/uevent.png"
        />
        <Stats
          mainstatsclass={statsBox}
          statstitleclass="stats-box-title"
          statstitle="Completed Events"
          statsitclass= 'flex items-center justify-between'
          statscontentclass="stats-content"
          statstextclass="stats-text"
          statsiconclass="stats-icon"
          statscount={previousCount}
          statsiconhref="/images/cevents.png"
        />
      </div>
      <EventCount/>
    </div>
  );
}

export default HomeAdmin;
