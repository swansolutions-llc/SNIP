import React, { useEffect, useState, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import axios from 'axios';
import '../../assets/css/style.css'
import Notification from '../../atoms/Notification';
import Heading from '../../atoms/Heading';
import { useRouter } from 'next/router';
import Picture from '../../atoms/Image';
import Image from 'next/image';



const SCCUserIdDetails = ({ tablerow, userId }) => {
  const [users, setUser] = useState({
    pizza_name: '',
    contest_image_url: '',
    meals_served_daily: '',
    vote: '',
    negative_meal_debt: '',
    breakfast_price: '',
    lunch_price: '',
    servings: '',
    prep_time: '',
    cooking_time: '',
    calories: '',
    ingredients: '',
    directions: '',
    notes: '',
    video: ''
  });
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editedVote, seteditedVote] = useState('');
  const [error, setError] = useState(null);
  const [editedPizzaname, seteditedPizzaName] = useState('');
  const [editedContestImage, seteditedContestImage] = useState('');

  const [editedMealsserved, seteditedMealsserved] = useState('');
  const [editedMealdebt, seteditedMealDebt] = useState('');
  const [editedBreakfastprice, seteditedBreakfastPrice] = useState('');
  const [editedLunchprice, seteditedLunchprice] = useState('');
  const labelClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';
  const [successnotify, Setsuccessnotify] = useState('');
  const [errornotify, Seterrornotify] = useState('');
  const [Editloading, SetEditLoading] = useState('');
  const [imageloading, setLoadingImage] = useState(false);
  const [imagechanged, setimagechanged] = useState(false)

  // Edit Recipe
  const [editedServings, seteditedServings] = useState('');
  const [editedPrepTime, seteditedPrepTime] = useState('');
  const [editedCookingTime, seteditedCookingTime] = useState('');
  const [editedCalories, seteditedCalories] = useState('');
  const [editedIngredients, seteditedIngredients] = useState('');
  const [editedDirections, seteditedDirections] = useState('');
  const [editedNotes, seteditedNotes] = useState('');
  const [editedVideo, seteditedVideo] = useState('');
  const [videochanged, setvideoChanged] = useState(false)
  const [videoloading, setLoadingVideo] = useState(false);
  const [scc_id, setUserID] = useState();


  // Open Edit Mode

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Video Changed
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    seteditedVideo(file);
    setvideoChanged(true);
    setLoadingVideo(true);
  };

  // Get SCC Users
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("getting data ")
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/getusersdata/${userId}`);
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
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


  const userData = async () => {
    try {
      if (users.length > 0) {
        seteditedPizzaName(users[0].pizza_name);
        seteditedContestImage(users[0].contest_image_url);
        seteditedMealsserved(users[0].meals_served_daily);
        seteditedVote(users[0].vote);
        seteditedMealDebt(users[0].negative_meal_debt);
        seteditedBreakfastPrice(users[0].breakfast_price);
        seteditedLunchprice(users[0].lunch_price);
        seteditedServings(users[0].servings);
        seteditedPrepTime(users[0].prep_time);
        seteditedCookingTime(users[0].cooking_time);
        seteditedCalories(users[0].calories);
        seteditedIngredients(users[0].ingredients);
        seteditedDirections(users[0].directions);
        seteditedNotes(users[0].notes);
        seteditedVideo(users[0].video);
        setUserID(users[0].scc_id);
        if (users[0].video) {
          seteditedVideo(users[0].video);
        } else {
          seteditedVideo('/images/emptyprofile.avif');
        }
        if (users[0].contest_image_url) {
          seteditedContestImage(users[0].contest_image_url);
        } else {
          seteditedContestImage('/images/emptyprofile.avif');
        }
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    userData();
  }, [users]);



  const handleUpdateuser = async () => {
    try {
      SetEditLoading(true);
      var imagePath;
      if (imagechanged == true) {
        const formData = new FormData();
        formData.append('image', editedContestImage);
        const response = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imagePath = "https://api.schoolnutritionindustryprofessionals.com/" + response.data.imagePath;
      }
      else {
        imagePath = editedContestImage
      }

      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/sccuseredit/${scc_id}`, {
        pizza_name: editedPizzaname,
        contest_image_url: imagePath,
        meals_served_daily: editedMealsserved,
        vote: editedVote,
        negative_meal_debt: editedMealdebt,
        breakfast_price: editedBreakfastprice,
        lunch_price: editedLunchprice
      });
      setUser({
        ...users,
        pizza_name: editedPizzaname,
        contest_image_url: imagePath,
        meals_served_daily: editedMealsserved,
        vote: editedVote,
        negative_meal_debt: editedMealdebt,
        breakfast_price: editedBreakfastprice,
        lunch_price: editedLunchprice
      });


      var videoPath;
      if (videochanged) {
        const formData = new FormData();
        formData.append('video', editedVideo);
        try {
          const response = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/videoupload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          videoPath = "https://api.schoolnutritionindustryprofessionals.com/" + response.data.videoPath;
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      } else {
        videoPath = users.video; // Use the existing video path
      }
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/sccrecipeedit/${scc_id}`, {
        servings: editedServings,
        prep_time: editedPrepTime,
        cooking_time: editedCookingTime,
        calories: editedCalories,
        ingredients: editedIngredients,
        directions: editedDirections,
        video: videoPath,
        notes: editedNotes
      });

      setUser({
        ...users,
        servings: editedServings,
        prep_time: editedPrepTime,
        cooking_time: editedCookingTime,
        calories: editedCalories,
        ingredients: editedIngredients,
        directions: editedDirections,
        video: videoPath,
        notes: editedNotes
      });
      setShowSuccessNotification(true);
      Setsuccessnotify('notifications');
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
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
      setEditMode(!editMode);
      setLoadingVideo(false);
      setimagechanged(false);
    }
  };




  // Contest Image

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    seteditedContestImage(file);
    setimagechanged(true);
    setLoadingImage(true);
  };
  const handleImageClick = () => {
    const fileInput = document.getElementById('editImageInput');
    fileInput.click();
  };

  if (loading) {
    return <div>Loading...  </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="container mx-auto p-4">
      {/* Pizza Edit */}
      <div className="full_form sign-up-form edit_contest_frm max-w-md rounded-md flex justify-center">
        <div className="shadow-md ">
          <div className='mb-8'>
          {editMode ? (
            <Heading level='4' headingText='Edit Contest Details' />
          ) : (
            <div className='flex justify-end view_details'>
              <button
                className='mt-3 rounded-md text-white px-3 py-2 text-sm font-semibold ring-1 hover:bg-gray-50 hover:text-black sm:col-start-1 sm:mt-0'
                onClick={toggleEditMode}
              >
                Edit Contest Details
              </button>
            </div>
          )}

            </div>
          <div className='flex gap-4 items-center justify-between'>
            <div className="current-image-container form_img_column">
              <label><span className={labelClass}>Contest Image</span></label>
              <Image
                width="200"
                height="200"
                htmlFor="editImageInput"
                src={editedContestImage}
                alt="Current"
                className="mb-4 edit-icon current-image"
              />
              {editMode && (
                <label htmlFor="editImageInput" className={`${labelClass} edit-icon`} disabled={loading}>
                  {imageloading ? 'Image Uploaded Done' : 'Change Image'}
                </label>
              )}

              
              <input
                id="editImageInput"
                type="file"
                className={inputClass}
                src={editedContestImage}
                readOnly={!editMode}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            <div className="current-image-container form_img_column">
            <label><span className={labelClass}>Contest Video</span></label>
              <video
                width="200"
                height="200"
                htmlFor="editVideoInput"
                src={editedVideo}
                alt="Current"
                className="edit-icon current-image mb-4"
              />
              {editMode && (
                <label htmlFor="editVideoInput" className={`${labelClass} edit-icon`} disabled={loading}>
                  {videoloading ? 'Video Uploaded Done' : 'Change Video'}
                </label>
              )}

              
              <input
                id="editVideoInput"
                type="file"
                readOnly={!editMode}
                className={inputClass}
                src={editedVideo}
                style={{ display: 'none' }}
                onChange={handleVideoChange}
              />
            </div>
          </div>
          <label className='mt-4'>
            <span className={labelClass}>Pizza Name</span>
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Pizza Name"
              value={editedPizzaname}
              onChange={(e) => seteditedPizzaName(e.target.value)}
              readOnly={!editMode}
            />
          </label>
          <label>
            <span className={labelClass}>Meals Served Daily</span>
            <input
              placeholder="0"
              required
              type='text'
              className={inputClass}
              value={editedMealsserved}
              onChange={(e) => seteditedMealsserved(e.target.value)}
              readOnly={!editMode}
            />
          </label>
          
          <label>
            <span className={labelClass}>Negative Meal Debt</span>
            <input
              placeholder="0"
              required
              type='text'
              className={inputClass}
              value={editedMealdebt}
              readOnly={!editMode}
              onChange={(e) => seteditedMealDebt(e.target.value)}
            />
          </label>
          <label>
            <span className={labelClass}>Break Fast Price</span>
            <input
              placeholder="0"
              required
              type='text'
              className={inputClass}
              value={editedBreakfastprice}
              readOnly={!editMode}
              onChange={(e) => seteditedBreakfastPrice(e.target.value)}
            />
          </label>
          <label>
            <span className={labelClass}>Lunch Price</span>
            <input
              placeholder="0"
              required
              type='text'
              className={inputClass}
              value={editedLunchprice}
              readOnly={!editMode}
              onChange={(e) => seteditedLunchprice(e.target.value)}
            />
          </label>
          <label className='mt-4'>
            <span className={labelClass}>Servings</span>
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Servings"
              value={editedServings}
              readOnly={!editMode}
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
              readOnly={!editMode}
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
              readOnly={!editMode}
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
              readOnly={!editMode}
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
              readOnly={!editMode}
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
              readOnly={!editMode}
            />
          </label>
          <label>
            <span className={labelClass}>Notes</span>
            <input
              placeholder="Notes"
              required
              type='text'
              className={inputClass}
              value={editedNotes}
              readOnly={!editMode}
              onChange={(e) => seteditedNotes(e.target.value)}
            />
          </label>


          {editMode ? (
            <button
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
              onClick={handleUpdateuser}
            >
              {Editloading ? ' Updating...' : ' Update User'}
            </button>
          ) : (
            <button
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
              onClick={toggleEditMode}
            >
              Edit Contest Details
            </button>
          )}

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
  );
};

export default SCCUserIdDetails;
