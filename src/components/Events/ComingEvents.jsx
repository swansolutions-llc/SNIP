import axios from 'axios';
import '../../../app/globals.css'
import Container from '../Container/Container';
import '../../../src/assets/css/style.css'
import React, { useEffect, useState, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import Link from 'next/link';




const ComingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [userData, setUserData] = useState(null);


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

  useEffect(() => {
    const initializeDataTable = () => {
      if (tableRef.current) {
        $(tableRef.current).DataTable({
          responsive: true,
        });
      }
    };

    const destroyDataTable = () => {
      const dataTable = $(tableRef.current).DataTable();
      if (dataTable) {
        dataTable.destroy();
      }
    };

    destroyDataTable();
    initializeDataTable();

    return () => {
      destroyDataTable();
    };
  }, [events]);


  // Get Users Data

  useEffect(() => {
    const userstorID = localStorage.getItem('userId'); // Assuming you store the token in localStorage
    const fetchUserData = async () => {
      try {

        const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/eventsuser/${userstorID}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user data:', data);
          const user = data.find((user) => user.id === Number(userstorID));
          if (user) {
            setUserData(user);
          } else {
            setError('User not found');
          }
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userstorID) {
      fetchUserData();
    }
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



  // Download Xlsx file
  const handleDownloadExcel = () => {
    // Prepare data for Excel file
    const excelData = events.map((event) => ({
      'Id': event.id,
      'Event Title': event.title,
      'Event Description': event.description,
      'Event Date': formatDate(event.start),
      'Event Start Time': formatTime(event.starttime),
      'Event End Time': formatTime(event.endtime),
      'Event URL': event.event_url,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');

    // Save the workbook to a file
    writeFile(wb, 'upcomingevents.xlsx');
  };



  return (
    <div>

      <div className="event-table my-12">
        <Container>
          <table ref={tableRef} id="myTable" className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-4">Id</th>
                <th className="border p-4">Event Title</th>
                <th className="border p-4">Event Description</th>
                <th className="border p-4">Event Date</th>
                <th className="border p-4">Event Start Time</th>
                <th className="border p-4">Event End Time</th>
                <th className="border p-4">Event Url</th>
                <th className="border p-4">User Signup</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-100">
                  <td className="border p-4">{event.id}</td>
                  <td className="border p-4">
                    <Link href={event.event_url}> {event.title} </Link>
                  </td>
                  <td className="border p-4">{event.description}</td>
                  <td className="border p-4">{formatDate(event.start)}</td>
                  <td className="border p-4">{formatTime(event.starttime)}</td>
                  <td className="border p-4">{formatTime(event.endtime)}</td>
                  <td className="border p-4">
                    <Link href={event.event_url}>{event.event_url}</Link>
                  </td>
                  <td className="border p-4">
                    {userData?.registered === 'Yes' ? (
                      'Signed Up'
                    ) : (
                      'Not Signed Up'
                    )}
                  </td>
                  {/* <td className="border p-4">
                <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
              </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='all-events-download'>
            <button
              className="text-white text-xl float-right inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-3 text-sm font-semibold shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              onClick={handleDownloadExcel}
            >
              Download All Events
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ComingEvents;