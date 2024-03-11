import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../app/globals.css'
import Container from '../Container/Container';
import '../../../src/assets/css/style.css'

const ComingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getUpcomingEvents');
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));

          setEvents(sortedData);
        } else {
          setError('Failed to fetch event data');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);


  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    
    <div className="event-table my-12">
      <Container>
      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-4">Id</th>
            <th className="border p-4">Event Title</th>
            <th className="border p-4">Event Description</th>
            <th className="border p-4">Event Date</th>
            <th className="border p-4">Event Start Time</th>
            <th className="border p-4">Event End Time</th>
            <th className="border p-4">Event Url</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-100">
              <td className="border p-4">{event.id}</td>
              <td className="border p-4">{event.title}</td>
              <td className="border p-4">{event.description}</td>
              <td className="border p-4">{formatDate(event.start)}</td>
                  <td className="border p-4">{formatTime(event.starttime)}</td>
                  <td className="border p-4">{formatTime(event.endtime)}</td>
              <td className="border p-4">{event.event_url}</td>
              {/* <td className="border p-4">
                <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </Container>
    </div>
    </div>
  );
};

export default ComingEvents;
