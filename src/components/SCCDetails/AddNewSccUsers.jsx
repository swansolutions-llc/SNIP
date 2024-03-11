// components/StepForm.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Picture from '../../atoms/Image';
import Heading from '../../atoms/Heading';
import '../../../app/globals.css'

const AddNewSccUser = ({seteventPartId}) => {
  const [hideRecipeDetails, setHideRecipeDetails] = useState(false);
  const [pizzaName, setPizzaName] = useState('');
  const [contestImage, setContestImage] = useState('');
  const [mealsServed, setMealsServed] = useState();
  const [breakfastPrice, setBreakfastPrice] = useState();
  const [lunchPrice, setLunchPrice] = useState();
  const lableClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';
  const loginfield = 'login-field';
  const submitClass = 'scc-submit-button flex items-center gap-4';
  const inputcolumnClass = 'items-center recipe_block'
  const [users, setUsers] = useState(null);
  const button = 'w-auto bg-violet-600 text-white px-4 mb-4 p-2 rounded hover:bg-violet-900';
  const [notificlass, setNotifyClass] = useState();
  const [erronotificlass, setErrorNotifyClass] = useState();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [negative_meal_debt, setNegativeMmealDebt] = useState();
  const [messagesuccess, setMessageSuccess] = useState('');
  const [messageerror, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [servings, setServings] = useState('');
  const [prep_time, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cooking_time, setCookingTime] = useState('');
  const [calories, setCalories] = useState('');
  const [directions, setDirections] = useState('');
  const [notes, setNotes] = useState('');
  const [video, setVideo] = useState('');
  const [userDistrictLogo, setUserDistrictLogo] = useState('');

  




  // District Logo Fetch
  const [userLogoId, setuserLogoId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/getdistrictlogo/${userLogoId}`);
  
        if (response.ok) {
          const data = await response.json();
          setUserDistrictLogo(data.logo);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [userLogoId]);

  
  const handleCheckboxChange = (e) => {
    setHideRecipeDetails(e.target.checked);
  };

  // Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let UsersdistrictLogo='';
    try {
    console.log('ho gya')
      let imagePath =  UsersdistrictLogo || userDistrictLogo;      
      if (contestImage) {
        const formData = new FormData();
        formData.append('image', contestImage);
          const response = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          imagePath = "https://api.schoolnutritionindustryprofessionals.com/" + response.data.imagePath;
        }
      // Upload Video
      let videoPath = ''; // Default videoPath value
      if (video) {
        const videoData = new FormData();
        videoData.append('video', video);
        const videoresponse = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/videoupload', videoData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        videoPath = "https://api.schoolnutritionindustryprofessionals.com/" + videoresponse.data.videoPath;
      }
      const recipeuserId = localStorage.getItem('userId');

      await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/sccdetails', {
        pizza_name: pizzaName,
        user_id: recipeuserId,
        contest_image_url: imagePath || UsersdistrictLogo || userDistrictLogo,
        meals_served_daily: parseInt(mealsServed, 10) || 0,
        breakfast_price: parseFloat(breakfastPrice) || 0,
        lunch_price: parseFloat(lunchPrice) || 0,
        negative_meal_debt: negative_meal_debt,
        servings: servings,
        prep_time: prep_time,
        ingredients: ingredients,
        cooking_time: cooking_time,
        calories: calories,
        directions: directions,
        video: videoPath,
        notes: notes,
      });
      const userRegistered = {
        registered: 'Yes'
      };
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/addregistered/${recipeuserId}`, userRegistered);
      const userParticpant = {
        user_id: recipeuserId,
        event_id: seteventPartId
      };
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/inserteventparticipant/`, userParticpant);
      setNotifyClass('notifications');
      setMessageSuccess('Sign Up Successfully');
      router.push('/');
    } catch (error) {
      console.log('chl bg ja')
    }
    setLoading(false);
    setcontestDetails(null);
    const timer = setTimeout(() => {
      setNotifyClass('')
      setErrorNotifyClass('')
      setMessage(null);
      setMessageError('')
      setMessageSuccess('')
    }, 5000);
    timer;
  };
  // Signup


  // Image Changed
  const handleImageChanged = (e) => {
    const file = e.target.files[0];
    setContestImage(file);
  };


  
  const handleNegativedebtValue = (e) => {
    setNegativeMmealDebt(e.target.value);
    console.log(negative_meal_debt);
  }


  // Users Data

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/slectusers');
        if (!response.ok) {
          throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);




  //Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };


  return (
    <div className='main-scc-form'>
      <p className={`notifiy ${notificlass}`}>{message}</p>
        <form onSubmit={handleSubmit}>
              <label htmlFor='text' className={lableClass}>Create A Catchy Pizza Name To Encourage Votes & Donations</label>
                <input required='required' placeholder='' className={inputClass} type="text" value={pizzaName} onChange={(e) => setPizzaName(e.target.value)} />
              <label htmlFor='file' className={lableClass}>Pizza Image</label>
                <input placeholder='' className={inputClass} type="file" onChange={handleImageChanged} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor='file' className={lableClass}>Recipe Details</label>
                <div style={{ display: 'flex', width: '18%', color: 'white', fontSize: '17px', fontWeight: '600', justifyContent: 'space-between' }}>
                  <label htmlFor="hideRecipeCheckbox">Skip For Later</label>
                  <input
                    type="checkbox"
                    id="hideRecipeCheckbox"
                    checked={hideRecipeDetails}
                    onChange={handleCheckboxChange}
                    style={{ transform: 'scale(1.5)' }} />
                </div>
              </div>
              {!hideRecipeDetails && (
                <>
                  <div className={`mb-4 recipe_block `}>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Servings</label>
                      <input type="text" placeholder="Servings" value={servings} onChange={(e) => setServings(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Prep Time</label>
                      <input type="text" placeholder="Prep Time" value={prep_time} onChange={(e) => setPrepTime(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                  </div>
                  <div className={`mb-4 recipe_block `}>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Cooking Time</label>
                      <input type="text" placeholder="Cooking Time" value={cooking_time} onChange={(e) => setCookingTime(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Calories</label>
                      <input type="text" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                  </div>
                  <div className={`mb-4 recipe_block recipe_area `}>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Ingredients</label>
                      <textarea type="text" placeholder="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Directions</label>
                      <textarea type="text" placeholder="Directions" value={directions} onChange={(e) => setDirections(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                  </div>
                  <div className={inputcolumnClass}>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Pizza Video</label>
                      <input placeholder='' className={`${inputClass} ${loginfield}`} type="file" onChange={handleVideoChange} />
                    </div>
                    <div className='form-column'>
                      <label htmlFor='text' className={lableClass}>Recipe Notes</label>
                      <input type="text" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} ${loginfield}`} />
                    </div>
                  </div>
                </>)}
              <label htmlFor='text' className={lableClass}>Enter Total Negative Meal Debt</label>
              <div className={`price_symble `}>
                <input required='required' placeholder='0' className={`${inputClass}`} type="text" value={negative_meal_debt} onChange={handleNegativedebtValue} />
              </div>
              <label htmlFor='text' className={lableClass} >Approximately how many meals does your district serve daily? (Include Breakfast, Lunch, Dinner and Snacks)</label>
              <div className={inputcolumnClass}>
                <input required='required' placeholder='' className={inputClass} type="text" value={mealsServed} onChange={(e) => setMealsServed(e.target.value)} />
              </div>
              <label htmlFor='text' className={`${lableClass}`}>Lunch Price</label>
              <div className={`price_symble .`}>
                <input required='required' placeholder='0' className={inputClass} type="text" value={lunchPrice} onChange={(e) => setLunchPrice(e.target.value)} />
              </div>
              <label htmlFor='text' className={lableClass}>BreakFast Price</label>
              <div className={`price_symble `}>
                <input required='required' placeholder='0' className={inputClass} type="text" value={breakfastPrice} onChange={(e) => setBreakfastPrice(e.target.value)} />
              </div>
              <button type='submit' className='submit-button'>
                {loading ? 'Submitting...' : 'Add Participant'}
              </button>
          </form>




        <p className={`${notificlass} m-4 rounded-md`}>{messagesuccess}</p>
        <p className={`${erronotificlass} m-4 rounded-md`}>{messageerror}</p>
    </div >
  );
};

export default AddNewSccUser;
