// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DropArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';



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
export default function Home() {

  // State variables
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoding] = useState(false);
  const [deletloading, setDeleteLoading] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [eventloading, setEventLoading] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    endDate: '',
    description: '',
    starttime: '',
    endtime: '',
    event_url: '',
    id: 0,
  });


// Fetch Event Data
  const fetchEventData = async () => {
    try {
      const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getevents');
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
              endDate: startDate.toISOString(),
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

  // Handle date click on the calendar
  const handleDateClick = (arg: { date: Date; jsEvent?: any }) => {
    const clickedElement = arg.jsEvent.target as HTMLElement;
    const defaultDateAriaLabel = clickedElement.closest('.fc-daygrid-day-top')?.querySelector('a')?.getAttribute('aria-label');
    const defaultDate = defaultDateAriaLabel ? new Date(defaultDateAriaLabel) : arg.date;
    console.log(defaultDate)
    setNewEvent({
      ...newEvent,
      // start: defaultDate || arg.date,
      id: new Date().getTime(),
    });

    setShowModal(true);
  };




  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const NewformatDate = (date: Date | string): string => {
    const formattedDate = date instanceof Date ? date : new Date(date);
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${year}-${month}-${day}`;
  };
  


  // const addEvent = (data: DropArg) => {
  //   const event: Event = {
  //     ...newEvent,
  //     start: formatDate(data.date),
  //     endDate: formatDate(data.date),
  //     title: editEvent.title ? editEvent.title : data.draggedEl.innerText,
  //     id: new Date().getTime(),
  //     starttime: data.draggedEl.innerText ? '' : data.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     endtime: data.draggedEl.innerText ? '' : '',
  //     description: '',
  //   };
  //   // if (!data.allDay) {
  //   //   const endDateTime = new Date(data.date);
  //   //   endDateTime.setMinutes(endDateTime.getMinutes() + 30);
  //   //   event.end = endDateTime.toISOString();
  //   //   event.endtime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  //   // }

  //   setAllEvents([event]);
  //   setShowModal(true);
  // };


  // Handle event deletion
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/events/${idToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // setAllEvents((prevEvents) => prevEvents.filter((event) => Number(event.id) !== Number(idToDelete)));
        const updatedEvent = await response.json();
        setAllEvents(updatedEvent);
        await fetchEventData();
        setDeleteLoading(false);
        setIdToDelete(null);
        setShowEditModal(false);
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Close all modals
  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({
      title: '',
      start: '',
      endDate: '',
      description: '',
      starttime: '',
      endtime: '',
      event_url: '',
      id: 0,
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  // Handle input change for event title
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };


  const handleAddURL = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      event_url: e.target.value,
    });
  };
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      starttime: e.target.value,
    });
  };
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      endtime: e.target.value,
    });
  };
  const handleEventDescription = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      description: e.target.value,
    });
  };

  
  

const handlesetStartDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const inputValue = new Date(e.target.value);

  setNewEvent({
    ...newEvent,
    start: inputValue instanceof Date ? inputValue : '',
  });
  console.log(inputValue instanceof Date ? inputValue : '')

};
const handlesetEndDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
  const inputValue = new Date(e.target.value);

  setNewEvent({
    ...newEvent,
    endDate: inputValue instanceof Date ? inputValue : '',
  });
};


  
  
  const addFullDay = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      const newStartTime = new Date();
      newStartTime.setHours(0, 0, 0, 0);
  
      const newEndTime = new Date();
      newEndTime.setHours(23, 59, 59, 999);
  
      const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };
  
      setNewEvent({
        ...newEvent,
        starttime: formatTime(newStartTime),
        endtime: formatTime(newEndTime),
      });
    } else {
      setNewEvent({
        ...newEvent,
        starttime: '',
        endtime: '',
      });
    }
  };
  
  



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEventLoading(true);
    const apiUrl = 'https://api.schoolnutritionindustryprofessionals.com/api/eventscalendar';
    // Ensure starttime and endtime are valid
    // const isValidDate = (dateString: string): boolean => !isNaN(new Date(dateString).getTime());
    // const startTime = isValidDate(newEvent.starttime) ? newEvent.starttime : null;
    // const endTime = isValidDate(newEvent.endtime) ? newEvent.endtime : null;



    const requestDetails = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newEvent,
        // start: newEvent.start instanceof Date ? newEvent.start.toLocaleDateString() : '',
      }),
    };

    try {
      const response = await fetch(apiUrl, requestDetails);
      console.log('Request:', requestDetails);

      if (response.ok) {
        const insertedEvent = await response.json();
        console.log(insertedEvent);
        setAllEvents(insertedEvent);
        await fetchEventData();


        setEventLoading(false);
        setShowModal(false);

        setNewEvent({
          title: '',
          start: '',
          endDate:'',
          description: '',
          starttime: '',
          endtime: '',
          event_url: '',
          id: 0,
        });
        
      } else {
        console.log('ok');
        const errorResponse = await response.text();
        console.error('Failed to add event. Server response:', errorResponse);
      }
    } catch (error) {
      console.error('Error during request:', error);
    }
  };


  // Edit Mode

  const [showEditModal, setShowEditModal] = useState(false);

  const [editEvent, setEditEvent] = useState<Event>({
    title: '',
    start: '',
    endDate: '',
    description: '',
    starttime: '',
    endtime: '',
    event_url: '',
    id: 0,
  });
  const [editEventId, setEditEventId] = useState<number | null>(null);



  const handleEditModal = (data: { event: { id: string } }) => {
    const eventId = Number(data.event.id);
    setIdToDelete(eventId);
    const postToEdit = allEvents.find((event) => Number(event.id) === eventId);
    if (postToEdit) {
      setEditEvent(postToEdit);
      setEditEventId(postToEdit.id);
      setShowEditModal(true);
    } else {
      console.error("Event not found for editing");
    }
  };




  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoding(true);

    const apiUrl = `https://api.schoolnutritionindustryprofessionals.com/api/eventsedit/${editEventId}`;
    const requestDetails = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editEvent.title,
        description: editEvent.description,
        start: editEvent.start,
        endDate: editEvent.endDate,
        event_url: editEvent.event_url,
        starttime: editEvent.starttime,
        endtime: editEvent.endtime,
      }),
    };

    try {
      const response = await fetch(apiUrl, requestDetails);

      if (response.ok) {
        const updatedEvent = await response.json();
        setAllEvents(updatedEvent);
        await fetchEventData();
        // setAllEvents((prevEvents) => [...prevEvents, updatedEvent]);
        // setAllEvents((prevEvents) =>
        //   prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        // );
        setShowEditModal(false);
        setEditEvent({
          title: '',
          start: '',
          endDate:'',
          description: '',
          starttime: '',
          endtime: '',
          event_url: '',
          id: 0,
        });
        setEditEventId(null);
        setLoding(false);
        setShowModal(false);
      } else {
        console.error('Failed to edit event');
        setLoding(false);
      }
    } catch (error) {
      console.error('Error during edit request:', error);
    }
  };




  // JSX structure for the component
  return (
    <>
      <main className="flex-col items-center justify-between">
        <div className="grid-cols-10">

          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, resourceTimelinePlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              }}
              events={allEvents as []}
              nowIndicator={true}
              editable={true}
              // droppable={false}
              // selectable={false}
              selectMirror={true}
              dateClick={handleDateClick}
              // drop={(data) => addEvent(data)}
              eventClick={(data) => handleEditModal(data)}
            />
          </div>
        </div>
        <Transition.Root show={showEditModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowEditModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    as="div"
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  // onClose={setShowDeleteModal} 

                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="flex items-start">
                        <form action="submit" className='w-full' onSubmit={handleEdit}>
                          <div className="mt-2">
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event Title</label>
                            <input
                              type="text"
                              name="title"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.title}
                              onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                              placeholder="Title"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event Description</label>
                            <input
                              type="text"
                              name="description"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.description}
                              onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                              placeholder="Event Description"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Add Event Start Date</label>
                            <input
                              type="date"
                              name="date"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.start instanceof Date ? formatDate(editEvent.start) : editEvent.start}
                              onChange={(e) => setEditEvent({ ...editEvent, start: e.target.value })}
                              placeholder="Event Date"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Add Event End Date</label>
                            <input
                              type="date"
                              name="date"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.endDate instanceof Date ? formatDate(editEvent.endDate) : editEvent.endDate}
                              onChange={(e) => setEditEvent({ ...editEvent, endDate: e.target.value })}
                              placeholder="Event Date"
                            />
                            <label className='mb-4 my-2 text-base font-semibold leading-6 text-gray-900'>Event Start Time</label>
                            <input
                              type="time"
                              name="starttime"
                              className="mb-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.starttime}
                              onChange={(e) => setEditEvent({ ...editEvent, starttime: e.target.value })}
                              placeholder="Event Start Time"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event End Time</label>
                            <input
                              type="time"
                              name="endtime"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.endtime}
                              onChange={(e) => setEditEvent({ ...editEvent, endtime: e.target.value })}
                              placeholder="Event End Time"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event URL</label>
                            <input
                              type="text"
                              name="eventurl"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={editEvent.event_url}
                              onChange={(e) => setEditEvent({ ...editEvent, event_url: e.target.value })}
                              placeholder="Event URL"
                            />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-3 sm:gap-3">
                            <button
                              type="submit"
                              disabled={loading}
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                            >
                              {loading ? 'Updating ...' : 'Update'}

                            </button>
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                              disabled={deletloading}
                              onClick={handleDelete}
                            >
                              {deletloading ? 'Deleting ...' : 'Delete'}
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={() => setShowEditModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>

                        {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div> */}
                        {/* <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Are you sure you want to delete this event?</p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>

                    </div> */}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                  >
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 sm:mt-5">
                        <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900">
                          Add Event
                        </Dialog.Title>
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event Title</label>
                            <input
                              type="text"
                              name="title"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.title}
                              onChange={(e) => handleChange(e)}
                              placeholder="Title"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event Description</label>
                            <input
                              type="text"
                              name="eventdescription"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.description}
                              onChange={(e) => handleEventDescription(e)}
                              placeholder="Event Description"
                            />
                            <label className='mb-4 my-2 text-base font-semibold leading-6 text-gray-900'>Event Start Date</label>
                            <input
                              type="date"
                              name="start"
                              className="mb-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.start instanceof Date ? NewformatDate(newEvent.start) : newEvent.start}
                              onChange={(e) => handlesetStartDate(e)}
                              placeholder="Event Start Date"
                            />
                            <label className='mb-4 my-2 text-base font-semibold leading-6 text-gray-900'>Event End Date</label>
                            <input
                              type="date"
                              name="endDate"
                              className="mb-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.endDate instanceof Date ? NewformatDate(newEvent.endDate) : newEvent.endDate}
                              onChange={(e) => handlesetEndDate(e)}
                              placeholder="Event Start Date"
                            />
                            <div className='flex full-day-radio items-center gap-4 mb-4'>
                              <label htmlFor="fullDay" className="ml-2 text-base font-semibold leading-6 text-gray-900">
                                Full Day
                              </label>
                              <input
                                type="checkbox"
                                id="fullDay"
                                name="fullDay"
                                onChange={addFullDay}
                              />
                            </div>

                            <label className='mb-4 my-2 text-base font-semibold leading-6 text-gray-900'>Event Start Time</label>
                            <input
                              type="time"
                              name="starttime"
                              className="mb-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.starttime}
                              onChange={(e) => handleStartTimeChange(e)}
                              placeholder="Event Start Time"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Event End Time</label>
                            <input
                              type="time"
                              name="endtime"
                              className="block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.endtime}
                              onChange={(e) => handleEndTimeChange(e)}
                              placeholder="Event End Time"
                            />
                            <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Add Event Url</label>
                            <input
                              type="text"
                              name="eventurl"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.event_url}
                              onChange={(e) => handleAddURL(e)}
                              placeholder="Add Event Url"
                            />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                              disabled={newEvent.title === '' || newEvent.start === '' || newEvent.endDate === '' || newEvent.starttime === '' || newEvent.endtime === '' || newEvent.description === '' || newEvent.event_url === ''}
                            >
                            {eventloading ? 'Creating ...' : 'Create'}

                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        


        {/* Edit Form */}

      </main>
    </>
  );
}
