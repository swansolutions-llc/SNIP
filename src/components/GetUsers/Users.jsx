import React, { useEffect, useState, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'datatables.net';
import axios from 'axios';
import { writeFile } from 'xlsx';
import '../../assets/css/style.css'
import * as XLSX from 'xlsx';
import Notification from '../../atoms/Notification';
import Heading from '../../atoms/Heading';
import { useRouter } from 'next/router';



const Users = ({ tablerow, userId }) => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [editinguser, setEditinguser] = useState(null);
  const [editedUser, setEditedUser] = useState('');
  const [editedEmail, seteditedEmail] = useState('');
  const [editedDistrict, seteditedDistrict] = useState('');
  const [editedLocation, seteditedLocation] = useState('');
  const labelClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';
  const [editedImage, setEditedImage] = useState('');
  const [imagechanged, setimagechanged] = useState(false)
  const [successnotify, Setsuccessnotify] = useState('');
  const [errornotify, Seterrornotify] = useState('');
  const [Editloading, SetEditLoading] = useState('');
  const [userdistrict, setUserDistrict] = useState('');
  const [districtid, SetDID] = useState();
  const [deleteSuccess, SetdeleteSuccess] = useState('');
  const [deleteError, SetdeleteError] = useState('');


  // Get Users
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/users');

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  // Get District
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getdistrict');

        if (response.ok) {
          const data = await response.json();
          setUserDistrict(data);
        } else {
        }
      } catch (error) {
      } finally {
      }
    };

    fetchUserData();
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
  }, [users]);



  const formattedDate = (date) => {
    const originalDate = new Date(date);
    const newDate = originalDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return newDate;

  }

  // Edite Users

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  };
  const closeeditform = async () => {
    try {
      setEditinguser(null);
    } catch (error) {
      console.error(error, 'Form Are Not Closed')
    }
  }

  const handleEdituser = (userId) => {
    // Check if userId is defined
    if (userId !== undefined) {
      const userToEdit = users.find((user) => user.id === userId);
      if (userToEdit) {
        setEditinguser(userToEdit);
        setEditedUser(userToEdit.username);
        seteditedEmail(userToEdit.email);
        seteditedDistrict(userToEdit.district);
        seteditedLocation(userToEdit.location);
      } else {
        console.error(`User with id ${userId} not found.`);
      }
    } else {
      console.error('userId is undefined.');
    }
  };



  // Delete Users

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        // Step 1: Check and delete related records in the `scc_details` table
        const sccDetailsResponse = await axios.delete(`https://api.schoolnutritionindustryprofessionals.com/api/usersccdelete/${userId}`);

        // Check if deletion was successful or no related records found
        if (sccDetailsResponse.status === 200) {
          // Success: Delete the user and update the state
          await axios.delete(`https://api.schoolnutritionindustryprofessionals.com/api/userdelete/${userId}`);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          setShowSuccessNotification(true);
          Setsuccessnotify('notifications');
          SetdeleteSuccess('User Delete Successfully')
          const timer = setTimeout(() => {
            setShowSuccessNotification(false);
            SetdeleteSuccess('');
            Setsuccessnotify('');
          }, 2000);
          setShowSuccessNotification(timer);
        } else if (sccDetailsResponse.status === 404) {
          // No related records found: Show a notification or handle as needed
          console.log('No related records found in scc_details table for user:', userId);
        } else {
          Seterrornotify('errornotifications');
          console.error('Unexpected error during deletion:', sccDetailsResponse.status);
        }
      } catch (error) {
        if (error) {
          await axios.delete(`https://api.schoolnutritionindustryprofessionals.com/api/userdelete/${userId}`);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          SetdeleteSuccess('User Delete Successfully')
          setShowSuccessNotification(true);
          Setsuccessnotify('notifications');
          const timer = setTimeout(() => {
            setShowSuccessNotification(false);
            SetdeleteSuccess('');
            Setsuccessnotify('');
          }, 2000);
          setShowSuccessNotification(timer);
        } else {
          console.error(error);
          Seterrornotify('errornotifications');
          SetdeleteError('Please try again')
          setTimeout(() => {
            SetdeleteError('');
            Seterrornotify('');
          }, 2000);
        }
        // Handle other errors

      }
    }
  };



  // District

  const handleChange = (e) => {
    const selectedDId = e.target.value;

    const selectedUser = userdistrict.find(user => user.id === parseInt(selectedDId, 10));

    if (selectedUser) {
      SetDID(selectedDId);
      seteditedDistrict(selectedUser.d_name);
      console.log('Selected User ID:', selectedDId);
      console.log('Selected District:', selectedUser.d_name);
    } else {
      console.error('District not found for ID:', selectedDId);
    }
  };


  //Update Users
  const handleUpdateuser = async () => {
    SetEditLoading(true);
    try {
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/useredit/${editinguser.id}`, {
        username: editedUser,
        email: editedEmail,
        district: editedDistrict,
        location: editedLocation,
        d_id: districtid
      });

      const updatedusers = users.map((user) =>
        user.id === editinguser.id ? { ...user, username: editedUser, email: editedEmail, district: editedDistrict, location: editedLocation, d_id: districtid } : user
      );
      setUsers(updatedusers);
      setShowSuccessNotification(true);
      Setsuccessnotify('notifications');
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setEditinguser(null);
        Setsuccessnotify('');
      }, 2000);
      setShowSuccessNotification(timer);
    } catch (error) {
      setErorNotifications(true);
      Seterrornotify('errornotifications');
      const timer = setTimeout(() => {
        setErorNotifications(false);
        Seterrornotify('');
      }, 2000);
      setErorNotifications(timer);
      console.error(error);
    } finally {
      setLoading(false);
      SetEditLoading(false);
    }
  };


  // Download Xlsx file
  const handleDownloadExcel = () => {
    // Prepare data for Excel file
    const excelData = users.map((user) => ({
      'Id': user.id,
      'User Name': user.username,
      'User Email': user.email,
      'User School/District': user.district,
      'User Register Date': formattedDate(user.signupdate),
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'users');

    // Save the workbook to a file
    writeFile(wb, 'users.xlsx');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <p className={successnotify}>{deleteSuccess}</p>
      <p className={errornotify}>{deleteError}</p>
      <table ref={tableRef} id="myTable" className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3">Id</th>
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Email</th>
            <th className="border border-gray-300 p-3">School/District</th>
            <th className="border border-gray-300 p-3">Sign Up Date</th>
            <th className="border border-gray-300 p-3">Location</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={tablerow}>
              <td className="border border-gray-100  p-3">{user.id}</td>
              <td className="border border-gray-300  p-3">{user.username}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3">{user.district}</td>
              <td className="border border-gray-300 p-3">{user.signupdate ? formattedDate(user.signupdate) : ''}</td>
              <td className="border border-gray-300 p-3">{user.location}</td>
              <td className="border flex items-center justify-between buttons-tab-row border-gray-300 p-3">
                <button className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold sm:ml-3 text-white shadow-sm hover:bg-gray-800 edit-users" onClick={() => handleEdituser(user.id)}>
                  Edit
                </button>
                <button className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto delete-post" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editinguser && (
        <div className='form-reg' id='headlessui-dialog-:r6:'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='edit-event-main flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className='close-frm-icon'>
                  <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                </div>
                <div className='mb-4'>
                  <Heading level='4' headingText='Edit User' />
                </div>

                <label className='mt-4'>
                  <span className={labelClass}>User Name</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="Giver Name"
                    value={editedUser}
                    onChange={(e) => setEditedUser(e.target.value)}
                  />
                </label>

                <label>
                  <span className={labelClass}>Email</span>
                  <input
                    placeholder="User Email Address"
                    required
                    type='email'
                    className={inputClass}
                    value={editedEmail}
                    onChange={(e) => seteditedEmail(e.target.value)}
                  />
                </label>

                <label>
                  <span className={labelClass}>School / District</span>
                  <select className={inputClass} required
                    // value={editedDistrict}
                    // onChange={(e) => seteditedDistrict(e.target.value)}
                    onChange={handleChange}
                  >
                    <option className='first-child-district'>{editedDistrict}</option>
                    {userdistrict && Array.isArray(userdistrict) && userdistrict.map((user) => (
                      <option key={user.id} value={user.id}>{user.d_name}</option>
                    ))}
                  </select>
                  </label>
                <label>
                  <span className={labelClass}>Location</span>
                  <input
                    placeholder="Location"
                    required
                    type='text'
                    className={inputClass}
                    value={editedLocation}
                    onChange={(e) => seteditedLocation(e.target.value)}
                  />
                </label>

                <button 
                  className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                  onClick={handleUpdateuser} disabled={loading}>
                  {Editloading ? ' Updating...' : ' Update User'}
                </button>

              </div>
              {showNotificationSuccess && (
                <Notification
                  className={`${successnotify}  success-notification`}
                  message='Update Successful!'
                />
              )}
              {showErorNotifications && (
                <Notification
                  className={`${errornotify} decline-notification`}
                  message=' Please try again '
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className='all-user-download'>
        <button
          className="text-white text-xl float-right inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-3 text-sm font-semibold shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
          onClick={handleDownloadExcel}
        >
          Download All Users
        </button>
      </div>
    </div>
  );
};

export default Users;
