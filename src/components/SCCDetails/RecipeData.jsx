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
import VideoPlayer from '../../atoms/VideoPlayes';



const RecipeData = ({ tablerow, userId }) => {
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

    // Edit Recipe

    const [editingrecipe, setEditingRecipe] = useState(null);
    const [editedServings, seteditedServings] = useState('');
    const [editedPrepTime, seteditedPrepTime] = useState('');
    const [editedCookingTime, seteditedCookingTime] = useState('');
    const [editedCalories, seteditedCalories] = useState('');
    const [editedIngredients, seteditedIngredients] = useState('');
    const [editedDirections, seteditedDirections] = useState('');
    const [editedVideo, seteditedVideo] = useState('');
    const [videochanged, setvideoChanged] = useState(false)
    const [videoloading, setLoadingVideo] = useState(false);
    const [editedNotes, seteditedNotes] = useState('');


    const handleEditRecipe = (userId) => {
        // Check if userId is defined
        if (userId !== undefined) {
            const recipeToEdit = users.find((recipe) => recipe.scc_id === userId);
            if (recipeToEdit) {
                setEditingRecipe(recipeToEdit);
                seteditedServings(recipeToEdit.servings);
                seteditedPrepTime(recipeToEdit.prep_time);
                seteditedCookingTime(recipeToEdit.cooking_time);
                seteditedCalories(recipeToEdit.calories);
                seteditedIngredients(recipeToEdit.ingredients);
                seteditedDirections(recipeToEdit.directions);
                seteditedNotes(recipeToEdit.notes);
                if (recipeToEdit.video) {
                    seteditedVideo(recipeToEdit.video);
                } else {
                    seteditedVideo('/images/emptyprofile.avif');
                }
            } else {
                console.error(`User with id ${userId} not found.`);
            }
        } else {
            console.error('userId is undefined.');
        }
    };

    // Update Recipe

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        seteditedVideo(file);
        setvideoChanged(true);
        setLoadingVideo(true);
    };

    const handleUpdateRecipe = async () => {
        SetEditLoading(true)
        var videoPath;
        if (videochanged) {
            const VideoData = new FormData();
            VideoData.append('video', editedVideo);
            try {
                const response = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/videoupload', VideoData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                videoPath = "https://api.schoolnutritionindustryprofessionals.com/" + response.data.videoPath;
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            videoPath = editingrecipe.video; // Use the existing video path
        }
        try {
            await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/sccrecipeedit/${editingrecipe.scc_id}`, {
                servings: editedServings,
                prep_time: editedPrepTime,
                cooking_time: editedCookingTime,
                calories: editedCalories,
                ingredients: editedIngredients,
                directions: editedDirections,
                video: videoPath,
                notes: editedNotes
            });

            const updatedusers = users.map((recipe) =>
                recipe.scc_id === editingrecipe.scc_id ? { ...recipe, servings: editedServings, prep_time: editedPrepTime, cooking_time: editedCookingTime, calories: editedCalories, ingredients: editedIngredients, directions: editedDirections, video: videoPath, notes: editedNotes, } : recipe
            );
            setUsers(updatedusers);
            setShowSuccessNotification(true);
            Setsuccessnotify('notifications');
            const timer = setTimeout(() => {
                setShowSuccessNotification(false);
                setEditingRecipe(null);
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


    // Get SCC Users
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/getregisteredusers');

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

    //   Close Edit Form
    const closeeditform = async () => {
        try {
            setEditingRecipe(null);
        } catch (error) {
            console.error(error, 'Form Are Not Closed')
        }
    }

    //   Time Formate

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
        <div className="container mx-auto p-4">
            <table ref={tableRef} id="myTable" className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3">Id</th>
                        <th className="border border-gray-300 p-3">User Name</th>
                        <th className="border border-gray-300 p-3">User Email</th>
                        <th className="border border-gray-300 p-3">Servings</th>
                        <th className="border border-gray-300 p-3">Prep Time</th>
                        <th className="border border-gray-300 p-3">Cooking Time</th>
                        <th className="border border-gray-300 p-3">Calories</th>
                        <th className="border border-gray-300 p-3">Ingredients</th>
                        <th className="border border-gray-300 p-3">Directions</th>
                        <th className="border border-gray-300 p-3">Recipe Video</th>
                        <th className="border border-gray-300 p-3">Notes</th>
                        <th className="border border-gray-300 p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className={tablerow}>
                            <td className="border border-gray-100  p-3">{user.scc_id}</td>
                            <td className="border border-gray-100  p-3">{user.username}</td>
                            <td className="border border-gray-100  p-3">{user.email}</td>
                            <td className="border border-gray-100  p-3">{user.servings}</td>
                            <td className="border border-gray-100  p-3">{user.prep_time}</td>
                            <td className="border border-gray-300  p-3">{user.cooking_time}</td>
                            <td className="border border-gray-300  p-3">{user.calories}</td>
                            <td className="border border-gray-300  p-3">{user.ingredients}</td>
                            <td className="border border-gray-300 p-3">{user.directions}</td>
                            <td className="border border-gray-300 p-3 video_tc">
                                <VideoPlayer autoplay={false} videoUrl={user.video} />
                            </td>
                            <td className="border border-gray-300 p-3">{user.notes}</td>
                            <td className="border flex items-center justify-between buttons-tab-row border-gray-300 p-3">
                                <button className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold sm:ml-3 text-white shadow-sm hover:bg-gray-800 edit-users" onClick={() => handleEditRecipe(user.scc_id)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Recipe Edit */}
            {editingrecipe && (
                <div className='form-reg' id='headlessui-dialog-:r6:'>
                    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
                    <div className='fixed inset-0 z-10 overflow-y-auto'>
                        <div className='edit_scc_recipe edit-event-main flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className='close-frm-icon'>
                                    <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                                </div>
                                <div className='mb-4'>
                                    <Heading level='4' headingText='Edit Recipe' />
                                </div>
                                <div className="current-image-container">
                                    <video
                                        width="200"
                                        height="200"
                                        htmlFor="editVideoInput"
                                        src={editedVideo}
                                        alt="Current"
                                        className="edit-icon current-image mb-4"
                                    />
                                    <label htmlFor="editVideoInput" className={`${labelClass} edit-icon`} disabled={loading}>
                                        {videoloading ? 'Video Uploaded Done' : 'Change Video'}
                                    </label>
                                    <input
                                        id="editVideoInput"
                                        type="file"
                                        className={inputClass}
                                        src="{editingrecipe.video}"
                                        style={{ display: 'none' }}
                                        onChange={handleVideoChange}
                                    />
                                </div>
                                <label className='mt-4'>
                                    <span className={labelClass}>Servings</span>
                                    <input
                                        type="text"
                                        required
                                        className={inputClass}
                                        placeholder="Servings"
                                        value={editedServings}
                                        onChange={(e) => seteditedServings(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className={labelClass}>Prep Time</span>
                                    <input
                                        placeholder="Prep Time"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedPrepTime}
                                        onChange={(e) => seteditedPrepTime(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className={labelClass}>Cooking Time</span>
                                    <input
                                        placeholder="Cooking Time"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedCookingTime}
                                        onChange={(e) => seteditedCookingTime(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className={labelClass}>Calories</span>
                                    <input
                                        placeholder="Calories"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedCalories}
                                        onChange={(e) => seteditedCalories(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className={labelClass}>Ingredients</span>
                                    <textarea
                                        placeholder="Ingredients"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedIngredients}
                                        onChange={(e) => seteditedIngredients(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span className={labelClass}>Directions</span>
                                    <textarea
                                        placeholder="Directions"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedDirections}
                                        onChange={(e) => seteditedDirections(e.target.value)}
                                    />
                                </label>
                                {/* <label>
                                    <span className={labelClass}>Recipe Video</span>
                                    <input
                                        placeholder="Recipe Video"
                                        required
                                        type='file'
                                        className={inputClass}
                                        value={editedVideo}
                                        onChange={(e) => seteditedVideo(e.target.value)}
                                    />
                                </label> */}
                                <label>
                                    <span className={labelClass}>Notes</span>
                                    <input
                                        placeholder="Notes"
                                        required
                                        type='text'
                                        className={inputClass}
                                        value={editedNotes}
                                        onChange={(e) => seteditedNotes(e.target.value)}
                                    />
                                </label>
                                <button
                                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                                    onClick={handleUpdateRecipe} disabled={loading}>
                                    {Editloading ? ' Updating...' : ' Update Recipe'}
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
        </div>
    );
};

export default RecipeData;
