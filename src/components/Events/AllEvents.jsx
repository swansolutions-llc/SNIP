import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../../app/globals.css'
import '../../../src/assets/css/style.css'
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import Container from '../Container/Container';
import Notification from '../../atoms/Notification';
import Link from 'next/link';




const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateloading, setUpdateLoading] = useState(false);

  const [error, setError] = useState(null);
  const tableData = useRef(null);
  const [editingevent, setEditingEvents] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [editedStartTime, setStartTime] = useState('');
  const [editedEndTime, setEndTime] = useState('');
  const [editedUrl, setUrl] = useState('');
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [errornotifiy, setErrorNotifiy] = useState(false);
  const [notifiy, setNotifiy] = useState(false);
  const [deleteSuccess, SetdeleteSuccess] = useState('');
  const [deleteError, SetdeleteError] = useState('');

  const lableClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';

  // Edit

  const closeeditform = async () => {
    try {
      setEditingEvents(null);
    } catch (error) {
      console.error(error, 'Form Are Not Closed');
    }
  };

  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);

    if (eventToEdit) {
      setEditingEvents(eventToEdit);
      setEditedTitle(eventToEdit.title);
      setEditedDate(eventToEdit.start);
      setEditedEndDate(eventToEdit.endDate)
      setEditedDescription(eventToEdit.description);
      setStartTime(eventToEdit.starttime);
      setEndTime(eventToEdit.endtime);
      setUrl(eventToEdit.event_url);
    }
  };

  const handleUpdateEvent = async () => {
    setUpdateLoading(true)

    try {
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/editevent/${editingevent.id}`, {
        title: editedTitle,
        description: editedDescription,
        start: editedDate,
        endDate: editedEndDate,
        starttime: editedStartTime,
        endtime: editedEndTime,
        event_url: editedUrl,
      });
      const updatedEvents = events.map((event) =>
        event.id === editingevent.id ? { ...event, title: editedTitle, description: editedDescription, start: editedDate, endDate: editedEndDate, starttime: editedStartTime, endtime: editedEndTime, event_url: editedUrl } : event
      );
      const sortedData = updatedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

      setEvents(sortedData);
      setNotifiy('notifications')
      setShowSuccessNotification(true);

      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setEditingEvents(null);
        setNotifiy(false);
      }, 2000);
      setShowSuccessNotification(timer);
    } catch (error) {
      setErrorNotifiy('errornotifications')
      setErorNotifications(true);
      const timer = setTimeout(() => {
        setErorNotifications(false);
        setErrorNotifiy(false);
      }, 2000);
      setErorNotifications(timer);
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };


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
    writeFile(wb, 'events.xlsx');
  };


  // 

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getevents');
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
      if (tableData.current) {
        $(tableData.current).DataTable({
          responsive: true,
        });
      }
    };

    const destroyDataTable = () => {
      const dataTable = $(tableData.current).DataTable();
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
  
// sorts
// ...

useEffect(() => {
  const initializeDataTable = () => {
    if (tableData.current) {
      $(tableData.current).DataTable({
        responsive: true,
      });
    }
  };

  const destroyDataTable = () => {
    const dataTable = $(tableData.current).DataTable();
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

// ...


  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    
    if (confirmDelete) {
      try {
        await axios.delete(`https://api.schoolnutritionindustryprofessionals.com/api/events/${eventId}`);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        setNotifiy('notifications')
        SetdeleteSuccess('Events Delete Successfully')
        setTimeout(() => {
          setNotifiy('');
          SetdeleteSuccess('');
        }, 2000);
      } catch (error) {
        console.error(error);
        setErrorNotifiy('errornotifications')
        SetdeleteError('Please try again')
        setTimeout(() => {
          setErrorNotifiy('');
          SetdeleteError('');
        }, 2000);
      }
    }
  };
  



  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    const time = new Date(`2000-01-01T${timeString}`);
    if (isNaN(time.getTime())) {
      return 'Invalid Time';
    }
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
      <p className={notifiy}>{deleteSuccess}</p>
      <p className={errornotifiy}>{deleteError}</p>
      <div className="event-table my-12">
        <Container>
          <table ref={tableData} id="myTable" className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-4">Id</th>
                <th className="border p-4">Event Title</th>
                <th className="border p-4">Event Description</th>
                <th className="border p-4">Event Start Date</th>
                <th className="border p-4">Event End Date</th>
                <th className="border p-4">Event Start Time</th>
                <th className="border p-4">Event End Time</th>
                <th className="border p-4">Event Url</th>
                <th className="border p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.sort((a, b) => new Date(a.start) - new Date(b.start)).map((event) => (

                <tr key={event.id} className="hover:bg-gray-100">
                  <td className="border p-4">{event.id}</td>
                  <td className="border p-4">
                    <Link href={event.event_url}>{event.title}</Link>
                  </td>
                  <td className="border p-4">{event.description}</td>
                  <td className="border p-4">{formatDate(event.start)}</td>
                  <td className="border p-4">{formatDate(event.endDate)}</td>
                  <td className="border p-4">{formatTime(event.starttime)}</td>
                  <td className="border p-4">{formatTime(event.endtime)}</td>
                  <td className="border p-4">
                    <Link href={event.event_url} >{event.event_url}</Link>
                  </td>
                  <td className="border buttons-tab-row p-4 flex items-center">
                    <button className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto edit-event-button" onClick={() => handleEditEvent(event.id)}>
                      Edit
                    </button>
                    <button className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



          {editingevent && (
            <div className='relative z-10' id='headlessui-dialog-:r0:'>
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 form-reg-he px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className="edit-event-main p-8 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className='close-frm-icon px-3 py-2'>
                      <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                    </div>
                    <h2 className='mb-4 text-2xl'>Edit Event</h2>

                    <label>
                      <span className={lableClass}>Event Title</span>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                    </label>

                    <label>
                      <span className={lableClass}>Description</span>
                      <input
                        className={inputClass}
                        placeholder="Event Description"
                        type='text'
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={lableClass}>Event Start Date</span>
                      <input
                        className={inputClass}
                        placeholder="Event Start Date"
                        type='date'
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={lableClass}>Event End Date</span>
                      <input
                        className={inputClass}
                        placeholder="Event End Date"
                        type='date'
                        value={editedEndDate}
                        onChange={(e) => setEditedEndDate(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={lableClass}>Event Start Time</span>
                      <input
                        className={inputClass}
                        placeholder="Event Start Time"
                        type='time'
                        value={editedStartTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={lableClass}>
                        Event End Time
                      </span>
                      <input
                        className={inputClass}
                        placeholder="Event End Time"
                        type='time'
                        value={editedEndTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={lableClass}>Event URL</span>
                      <input
                        className={inputClass}
                        type="text"
                        placeholder="Event URL"
                        value={editedUrl}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </label>
                    <button type='submit'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                      disabled={updateloading}
                      onClick={handleUpdateEvent}
                    >
                      {updateloading ? ' Updating...' : ' Update Event'}
                    </button>

                  </div>
                  {showNotificationSuccess && (
                    <Notification
                      className={`${notifiy} success-notification`}
                      message='Update Successful!'
                    />
                  )}
                  {showErorNotifications && (
                    <Notification
                      className={`${errornotifiy} decline-notification`}
                      message=' Please try again '
                    />
                  )}
                </div>
              </div>
            </div>
          )}
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

export default AllEvents;