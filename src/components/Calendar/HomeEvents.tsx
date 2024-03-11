// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DropArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import FullCalendar from '@fullcalendar/react';

interface Event {
  title: string;
  start: Date | string;
  endDate: Date | string;
  description: string;
  id: number;
  starttime: string;
  endtime: string;
  event_url: string;
}

// Define the Home component
export default function HomeEvents() {
  // State variables
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  
// Fetch Event Data
const fetchEventData = async () => {
  try {
    const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getUpcomingEvents');
    if (response.ok) {
      const data: Event[] = await response.json();
      setAllEvents(data);

      // If data contains events with start and end dates, generate events for each day in the range
      const eventsToAdd: Event[] = [];
      data.forEach((event: Event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.endDate);

        while (startDate <= endDate) {
          eventsToAdd.push({
            ...event,
            start: startDate.toISOString(),
            endDate: endDate.toISOString(),  // Fix here
            title: event.title, 
          });
          

          startDate.setDate(startDate.getDate() + 1);
        }
      });

      // Add the generated events to the state
      setAllEvents((prevEvents) => [...prevEvents, ...eventsToAdd]);
    } else {
      console.error('Failed to fetch event data');
    }
  } catch (error) {
    console.error(`Error: 'ni chala'`);
  }
};

useEffect(() => {
  fetchEventData();
}, []);
  
  


  // JSX structure for the component
  return (
    <>
      <main className="flex-col items-center justify-between">
        <div className="grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, resourceTimelinePlugin,  interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={allEvents as []}
              // nowIndicator={true}
              // selectable={true}
            />
          </div>
        </div>
      </main>
    </>
  );
}
