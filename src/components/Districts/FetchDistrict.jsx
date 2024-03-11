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
import Image from 'next/image';
import Picture from '../../atoms/Image';
import Link from 'next/link';


const FetchDistrict = ({ tablerow, userId }) => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const labelClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';
  const [successnotify, Setsuccessnotify] = useState('');
  const [errornotify, Seterrornotify] = useState('');
  const [Editloading, SetEditLoading] = useState('');
  const [imageloading, setLoadingImage] = useState(false);
  const [coverimageloading, setCoverLoadingImage] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getdistrict');

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




  useEffect(() => {
    const initializeDataTable = () => {
      if (tableRef.current) {
        const dataTable = $(tableRef.current).DataTable({
          responsive: true,
        });
        // Additional DataTable initialization configurations can be added here
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



  // Edit District// Edit District
  const [editingdistrict, setEditingDistrict] = useState(null);
  const [editeddname, setDName] = useState('');
  const [editeddemail, setDEmail] = useState('');
  const [editeddlocation, setDLocation] = useState('');
  const [editedDistrictFacebook, setDistrictFacebook] = useState('');
  const [editedphone, setDPhone] = useState('');
  const [editedstate, setDState] = useState('');
  const [editedlogo, setDLogo] = useState(''); // Uncomment these lines if needed
  const [editedcover, setDCover] = useState('');
  const [editedaboutus, setDAboutUs] = useState('');
  const [imagechanged, setimagechanged] = useState(false)
  const [coverimagechanged, setCoverimagechanged] = useState(false)
  const [successMessage, SetSuccessMessage] = useState('');
  const [errorMessage, SetErrorMessage] = useState('');

  useEffect(() => {
    if (editingdistrict) {
      setDName(editingdistrict.d_name);
      setDEmail(editingdistrict.d_email);
      setDLocation(editingdistrict.d_location);
      setDistrictFacebook(editingdistrict.district_facebook);
      setDPhone(editingdistrict.phone);
      setDState(editingdistrict.state);
      setDLogo(editingdistrict.logo || '/images/emptyprofile.avif');
      setDCover(editingdistrict.cover || '/images/emptyprofile.avif');
      setDAboutUs(editingdistrict.aboutus);
    }
  }, [editingdistrict]);

  const handleEdituser = (userId) => {
    console.log(userId);
    // Check if userId is defined
    if (userId !== undefined) {
      const districtToEdit = users.find((user) => user.id === userId);
      if (districtToEdit) {
        setEditingDistrict(districtToEdit);
      } else {
        console.error(`District with id ${userId} not found.`);
      }
    } else {
      console.error('District ID is undefined.');
    }
  };


  // Delete District

  const handleDistrictDelete = async (districtId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://api.schoolnutritionindustryprofessionals.com//api/districtdelete/${districtId}`);
        // const updateddistrict = users.filter((user) => user.id !== districtId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== districtId));
        SetSuccessMessage('District Delete Successfully')
        setShowSuccessNotification(true);
        Setsuccessnotify('notifications');

        const timer = setTimeout(() => {
          SetSuccessMessage('');
          setShowSuccessNotification(false)
          Setsuccessnotify('');
        }, 4000);
        timer;
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error(error);
        setErorNotifications(true);
        Seterrornotify('errornotifications');
        SetErrorMessage('Please try again')
        const timer = setTimeout(() => {
          SetErrorMessage('');
          setErorNotifications(false)
          Seterrornotify('');
        }, 4000);
        timer;
      }
    };
  };


  // Image Change

  const handleCoverImageClick = () => {
    const fileInput = document.getElementById('editCoverImageInput');
    fileInput.click();
  };
  const handleImageClick = () => {
    const fileInput = document.getElementById('editImageInput');
    fileInput.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setDLogo(file);
    setimagechanged(true);
    setLoadingImage(true);
    console.log('image added')
  };
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setDCover(file);
    setCoverimagechanged(true);
    setCoverLoadingImage(true);
    console.log('image added')
  };

  // Update District
  const handleUpdateuser = async () => {
    try {
      SetEditLoading(true);
      var logoPath;
      var coverPath;
      if (imagechanged == true) {
        const formDataLogo = new FormData();
        formDataLogo.append('logo', editedlogo);
        const logoupload = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/logoupload', formDataLogo, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        logoPath = "https://api.schoolnutritionindustryprofessionals.com/" + logoupload.data.logoPath;
      } else {
        logoPath = editedlogo
      }
      if (coverimagechanged == true) {
        const formDataCover = new FormData();
        formDataCover.append('cover', editedcover);
        const coverupload = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/coverupload', formDataCover, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        coverPath = "https://api.schoolnutritionindustryprofessionals.com/" + coverupload.data.coverPath;
      } else {
        coverPath = editedcover
      }
      console.log(logoPath)
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/districtedit/${editingdistrict.id}`, {
        d_name: editeddname,
        d_email: editeddemail,
        d_location: editeddlocation,
        district_facebook: editedDistrictFacebook,
        phone: editedphone,
        state: editedstate,
        logo: logoPath,
        cover: coverPath,
        aboutus: editedaboutus

      });

      const DistrictUpdate = {
        district : editeddname
      }
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/userdistrictedit/${editingdistrict.id}`, DistrictUpdate)
     
      const updatedusers = users.map((user) =>
      user.id === editingdistrict.id ? { ...user, d_name: editeddname, d_email: editeddemail, d_location: editeddlocation, district_facebook: editedDistrictFacebook, phone: editedphone, state: editedstate, logo: logoPath, cover: coverPath, aboutus: editedaboutus } : user);
      setUsers(updatedusers);
      setShowSuccessNotification(true);
      Setsuccessnotify('notifications');
      SetSuccessMessage('District Updated Successfully');
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setEditingDistrict(null);
        SetSuccessMessage('');
      }, 2000);
      setShowSuccessNotification(timer);
    } catch (error) {
      setErorNotifications(true);
      Seterrornotify('errornotifications');
      SetErrorMessage('Please try again')
      const timer = setTimeout(() => {
        setErorNotifications(false);
        SetErrorMessage('');
      }, 2000);
      setErorNotifications(timer);
      console.error(error);
    } finally {
      setLoading(false);
      SetEditLoading(false);
    }
  };

  // Close Form

  const closeeditform = async () => {
    try {
      setEditingDistrict(null);
    } catch (error) {
      console.error(error, 'Form Are Not Closed')
    }
  }

  // Download Xlsx file
  const handleDownloadExcel = () => {
    // Prepare data for Excel file
    const excelData = users.map((user) => ({
      'Id': user.id,
      'District Name': user.d_name,
      'District Email': user.d_email,
      'District Location': user.d_location,
      'District Contact': user.phone,
      'District State': user.state,
      'District Logo': user.logo,
      'District Cover': user.cover,
      'District About': user.aboutus,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'users');

    // Save the workbook to a file
    writeFile(wb, 'district.xlsx');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <table ref={tableRef} id="myTable" className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3">Id</th>
            <th className="border border-gray-300 p-3">District Name</th>
            <th className="border border-gray-300 p-3">District Email</th>
            <th className="border border-gray-300 p-3">District Location</th>
            <th className="border border-gray-300 p-3">District Facebook URL</th>
            <th className="border border-gray-300 p-3">District Contact</th>
            <th className="border border-gray-300 p-3">About District</th>
            <th className="border border-gray-300 p-3">District Logo Image</th>
            <th className="border border-gray-300 p-3">Dictrict Cover Image</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={tablerow}>
              <td className="border border-gray-100  p-3">{user.id}</td>
              <td className="border border-gray-300  p-3">{user.d_name}</td>
              <td className="border border-gray-300 p-3">{user.d_email}</td>
              <td className="border border-gray-300 p-3">{user.d_location}</td>
              <td className="border border-gray-300 p-3">
                <a href={user.district_facebook}>{user.district_facebook}</a>
              </td>
              <td className="border border-gray-300 p-3">{user.phone}</td>
              <td className="border border-gray-300 p-3">{user.aboutus}</td>
              <td className="border border-gray-300 p-3 dist-images">
                <Picture src={user.logo} />
              </td>
              <td className="border border-gray-300 p-3 dist-images">
                <Picture src={user.cover} />
              </td>
              <td className="border flex items-center justify-between buttons-tab-row border-gray-300 p-3">
                <button className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto delete-post" onClick={() => handleDistrictDelete(user.id)}>
                  Delete
                </button>
                <button className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 edit-users" onClick={() => handleEdituser(user.id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingdistrict && (
        <div className='form-reg edit-district' id='headlessui-dialog-:r6:'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
          <div className='edit-event-main fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className='close-frm-icon'>
                  <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                </div>
                <Heading level='4' headingText='Edit District' />
                <div className="current-image-container">
                  <Image
                    width="200"
                    height="200"
                    onClick={handleImageClick}
                    htmlFor="editImageInput"
                    src={editedlogo}
                    alt="Current"
                    className="edit-icon current-image"
                  />
                  <label htmlFor="editImageInput" className={`${labelClass} edit-icon`} disabled={loading}>
                    {imageloading ? 'Image Uploaded Done' : 'Change Logo Image'}
                  </label>
                  <input
                    id="editImageInput"
                    type="file"
                    className={inputClass}
                    src="{editinguser.logo}"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
                <div className="current-image-container">
                  <Image
                    width="200"
                    height="200"
                    onClick={handleCoverImageClick}
                    htmlFor="editCoverImageInput"
                    src={editedcover}
                    alt="Current"
                    className="edit-icon current-image"
                  />
                  <label htmlFor="editCoverImageInput" className={`${labelClass} edit-icon`} disabled={loading}>
                    {coverimageloading ? 'Image Uploaded Done' : 'Change Cover Image'}
                  </label>
                  <input
                    id="editCoverImageInput"
                    type="file"
                    className={inputClass}
                    src="{editinguser.cover}"
                    style={{ display: 'none' }}
                    onChange={handleCoverImageChange}
                  />
                </div>

                <label>
                  <span className={labelClass}>District Name</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="District Name"
                    value={editeddname}
                    onChange={(e) => setDName(e.target.value)}
                  />
                </label>

                <label>
                  <span className={labelClass}>District Email</span>
                  <input
                    placeholder="District Email Address"
                    required
                    type='email'
                    className={inputClass}
                    value={editeddemail}
                    onChange={(e) => setDEmail(e.target.value)}
                  />
                </label>
                <label>
                  <span className={labelClass}>District Location</span>
                  <input
                    placeholder="District Location"
                    required
                    type='text'
                    className={inputClass}
                    value={editeddlocation}
                    onChange={(e) => setDLocation(e.target.value)}
                  />
                </label>
                <label>
                  <span className={labelClass}>District Facebook Page URL</span>
                  <input
                    placeholder="District Facebook URL"
                    required
                    type='text'
                    className={inputClass}
                    value={editedDistrictFacebook}
                    onChange={(e) => setDistrictFacebook(e.target.value)}
                  />
                </label>
                <label>
                  <span className={labelClass}>District Contact</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="District Contact"
                    value={editedphone}
                    onChange={(e) => setDPhone(e.target.value)}
                  />
                </label>
                <label>
                  <span className={labelClass}>District State</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="District State"
                    value={editedstate}
                    onChange={(e) => setDState(e.target.value)}
                  />
                </label>
                {/* <label className={labelClass}>
                  <span>District Logo Image</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="District Logo Image"
                    value={editedlogo}
                    onChange={(e) => setDLogo(e.target.value)}
                  />
                </label>
                <label className={labelClass}>
                  <span>District Cover Image</span>
                  <input
                    type="text"
                    required
                    className={inputClass}
                    placeholder="District Cover Image"
                    value={editedcover}
                    onChange={(e) => setDCover(e.target.value)}
                  />
                </label> */}
                <label>
                  <span className={labelClass}>About District</span>
                  <textarea
                    type="text"
                    required
                    className={`${inputClass} p-2`}
                    placeholder="About District"
                    value={editedaboutus}
                    onChange={(e) => setDAboutUs(e.target.value)}
                  />
                </label>

                <button 
                  className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                  onClick={handleUpdateuser} disabled={loading}>
                  {Editloading ? ' Updating...' : ' Update District'}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
      {showNotificationSuccess && (
        <Notification
          className={`${successnotify}  success-notification`}
          message={successMessage}
        />
      )}
      {showErorNotifications && (
        <Notification
          className={`${errornotify} decline-notification`}
          message={errorMessage}
        />
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

export default FetchDistrict;
