import React, { useEffect, useState, useRef } from 'react';
import '../../../app/globals.css'
import Container from '../Container/Container';
import '../../../src/assets/css/style.css'
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import DataTable from 'datatables.net';
import Heading from '../../atoms/Heading';
import Notification from '../../atoms/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';



const Community_get_edit = () => {
    const [editingcomunity, setEditingCommunity] = useState(null);
    const [community, setCommunity] = useState([]);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successnotify, Setsuccessnotify] = useState('');
    const [errornotify, Seterrornotify] = useState(''); const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
    const [showErorNotifications, setErorNotifications] = useState(false);
    const [editedfname, setEditedFName] = useState('');
    const [editedlname, setEditedLName] = useState('');
    const [editedemail, setEditedemail] = useState('');
    const [editedcompany, setEditedcompany] = useState('');
    const [editedphone, setEditedphone] = useState('');
    const [editedaddress, setEditedaddress] = useState('');
    const [editedtitle, setEditedtitle] = useState('');
    const [editedcity, setEditedcity] = useState('');
    const [editedzipcode, setEditedzipcode] = useState('');
    const [editedwebsite, setEditedwebsite] = useState('');
    const [editedstate, setEditedstate] = useState('');
    const [Editloading, SetEditLoading] = useState('');
    const labelClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
    const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';


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
    }, [community]);


    // Fetch Data
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/communityphonebook');
                if (response.ok) {
                    const data = await response.json();
                    setCommunity(data);
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

    // Handle Edit User

    const handleEdituser = (userId) => {
        if (userId !== undefined) {
            const userToEdit = community.find((community) => community.id === userId);
            if (userToEdit) {
                setEditingCommunity(userToEdit);
                setEditedFName(userToEdit.f_name);
                setEditedLName(userToEdit.l_name);
                setEditedemail(userToEdit.email);
                setEditedcompany(userToEdit.company);
                setEditedtitle(userToEdit.title);
                setEditedstate(userToEdit.state);
                setEditedphone(userToEdit.phone);
                setEditedaddress(userToEdit.address);
                setEditedcity(userToEdit.city);
                setEditedzipcode(userToEdit.zip_code);
                setEditedwebsite(userToEdit.website);
            } else {
                console.error(`User with id ${userId} not found.`);
            }
        } else {
            console.error('userId is undefined.');
        }
    };

    //Update Users
    const handleUpdateuser = async () => {
        SetEditLoading(true);
        try {
            await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/communityeditphonebook/${editingcomunity.id}`, {
                f_name: editedfname,
                l_name: editedlname,
                email: editedemail,
                title: editedtitle,
                company: editedcompany,
                phone: editedphone,
                address: editedaddress,
                city: editedcity,
                zip_code: editedzipcode,
                state: editedstate,
                website: editedwebsite
            });

            const updatedusers = community.map((community) =>
                community.id === editingcomunity.id ? {
                    ...community,
                    f_name: editedfname,
                    l_name: editedlname,
                    email: editedemail,
                    title: editedtitle,
                    company: editedcompany,
                    phone: editedphone,
                    address: editedaddress,
                    city: editedcity,
                    zip_code: editedzipcode,
                    state: editedstate,
                    website: editedwebsite,
                } : community
            );
            setCommunity(updatedusers);
            setShowSuccessNotification(true);
            Setsuccessnotify('notifications');
            const timer = setTimeout(() => {
                setShowSuccessNotification(false);
                setEditingCommunity(null);
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
    const excelData = community.map((community) => ({
      'Id': community.id,
      'First Name': community.f_name,
      'Last Name': community.l_name,
      'Email': community.email,
      'Company': community.company,
      'Title': community.title,
      'Phone': community.phone,
      'Address': community.address,
      'City': community.city,
      'State': community.state,
      'Zip Code': community.zip_code,
      'Website Url': community.website,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'users');

    // Save the workbook to a file
    writeFile(wb, 'community-phone-book.xlsx');
  };




    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Close Form

    const closeeditform = async () => {
        try {
            setEditingCommunity(null);
        } catch (error) {
            console.error(error, 'Form Are Not Closed')
        }
    }


    return (
        <div>
            <div className="event-table my-12">
                <Container>
                    <table ref={tableRef} id="myTable" className="w-full table-auto border border-collapse border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-4">Id</th>
                                <th className="border p-4">First Name</th>
                                <th className="border p-4">Last Name</th>
                                <th className="border p-4">Email</th>
                                <th className="border p-4">Company</th>
                                <th className="border p-4">Title</th>
                                <th className="border p-4">Phone</th>
                                <th className="border p-4">Address</th>
                                <th className="border p-4">City</th>
                                <th className="border p-4">State</th>
                                <th className="border p-4">Zip Code</th>
                                <th className="border p-4">Website URL</th>
                                <th className="border p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {community.map((community) => (
                                <tr key={community.id} className="hover:bg-gray-100">
                                    <td className="border p-4">{community.id}</td>
                                    <td className="border p-4">{community.f_name}</td>
                                    <td className="border p-4">{community.l_name}</td>
                                    <td className="border p-4">{community.email}</td>
                                    <td className="border p-4">{community.company}</td>
                                    <td className="border p-4">{community.title}</td>
                                    <td className="border p-4">{community.phone}</td>
                                    <td className="border p-4">{community.address}</td>
                                    <td className="border p-4">{community.city}</td>
                                    <td className="border p-4">{community.state}</td>
                                    <td className="border p-4">{community.zip_code}</td>
                                    <td className="border p-4">{community.website}</td>
                                    <td className="border p-4">
                                        <button className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold sm:ml-3 text-white shadow-sm hover:bg-gray-800 edit-users" onClick={() => handleEdituser(community.id)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {editingcomunity && (
                        <div className='form-reg' id='headlessui-dialog-:r6:'>
                            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
                            <div className='fixed inset-0 z-10 overflow-y-auto'>
                                <div className='edit-event-main flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                                    <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                        <div className='close-frm-icon'>
                                            <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                                        </div>
                                        <div className='mb-4'>
                                            <Heading level='4' headingText='Edit Community Phone Book' />
                                        </div>

                                        <label className='mt-4'>
                                            <span className={labelClass}>First Name</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="First Name"
                                                value={editedfname}
                                                onChange={(e) => setEditedFName(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Last Name</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Last Name"
                                                value={editedlname}
                                                onChange={(e) => setEditedLName(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Email</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Email"
                                                value={editedemail}
                                                onChange={(e) => setEditedemail(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Company</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Company"
                                                value={editedcompany}
                                                onChange={(e) => setEditedcompany(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Title</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Title"
                                                value={editedtitle}
                                                onChange={(e) => setEditedtitle(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Phone</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Phone"
                                                value={editedphone}
                                                onChange={(e) => setEditedphone(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Address</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Address"
                                                value={editedaddress}
                                                onChange={(e) => setEditedaddress(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>City</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="City"
                                                value={editedcity}
                                                onChange={(e) => setEditedcity(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>State</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="State"
                                                value={editedstate}
                                                onChange={(e) => setEditedstate(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Zip Code</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Zip Code"
                                                value={editedzipcode}
                                                onChange={(e) => setEditedzipcode(e.target.value)}
                                            />
                                        </label>
                                        <label className='mt-4'>
                                            <span className={labelClass}>Website URL</span>
                                            <input
                                                type="text"
                                                required
                                                className={inputClass}
                                                placeholder="Website URL"
                                                value={editedwebsite}
                                                onChange={(e) => setEditedwebsite(e.target.value)}
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
                        Download Community Phone Book
                        </button>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Community_get_edit;
