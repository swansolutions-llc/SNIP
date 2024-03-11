import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../../../app/globals.css'
import axios from 'axios';
import 'react-image-lightbox/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Notification from '../../atoms/Notification';
import Lightbox from 'react-image-lightbox';
import '../../../src/assets/css/form.css'
import '../../../src/assets/css/profile.css'
import Container from '../Container/Container';
import Picture from '../../atoms/Image';
import Image from 'next/image';
import Heading from '../../atoms/Heading'
import Paragraph from '../../atoms/Paragraph';



const AdminProfile = ({ profileinrclass }) => {
  const router = useRouter();
  const { id } = router.query;
  const [users, setusers] = useState([]);
  const [editinguser, setEditinguser] = useState(null);
  const [editedUser, setEditedUser] = useState('');
  const [editedEmail, seteditedEmail] = useState('');
  const [editedLocation, seteditedLocation] = useState('');
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [editedImage, setEditedImage] = useState('');
  const [imagechanged, setimagechanged] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageloading, setLoadingImage] = useState(false);
  const [setloading, seterrorLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errornotifiy, setErrorNotifiy] = useState(null);
  const [notifications, setSuccessNotifications] = useState(null);
  
  const openLightbox = (index) => {
    setLightboxOpen(true);
    setLightboxIndex(index);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
    setimagechanged(true);
    setLoadingImage(true);
  };

  const handleDeleteuser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://api.schoolnutritionindustryprofessionals.com//api/userdelete/${userId}`);
        const updatedusers = users.filter((user) => user.id !== userId);
        setusers(updatedusers);
        router.push('/signup');
      } catch (error) {
        // Handle error (e.g., show an error message)
        console.error(error);
      }
    };
  };
  const closeeditform = async () => {
    try {
      setEditinguser(null);
    } catch (error) {
      console.error(error, 'Form Are Not Closed')
    }
  }

  const handleEdituser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditinguser(userToEdit);
    setEditedUser(userToEdit.username);
    seteditedEmail(userToEdit.email);
    seteditedLocation(userToEdit.location);
    setEditedImage(userToEdit.profileimage);
    if (userToEdit.profileimage) {
      setEditedImage(userToEdit.profileimage);
    } else {
      setEditedImage('/images/emptyprofile.avif'); 
    }
  };

  const handleUpdateuser = async () => {

    try {
      var imagePath;
      setLoading(true);
      if (imagechanged == true) {
        const formData = new FormData();
        formData.append('image', editedImage);
        const response = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imagePath = "https://api.schoolnutritionindustryprofessionals.com/" + response.data.imagePath;
      }
      else {
        imagePath = editedImage
      }
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/useredit/${editinguser.id}`, {
        username: editedUser,
        email: editedEmail,
        location: editedLocation,
        profileimage: imagePath
      });
      const updatedusers = users.map((user) =>
        user.id === editinguser.id ? { ...user, username: editedUser, email: editedEmail, location:editedLocation, profileimage: imagePath } : user
      );
      setusers(updatedusers);
      setShowSuccessNotification(true);
      setSuccessNotifications('notifications')
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setEditinguser(null);
        setSuccessNotifications('');
      }, 2000);
      setShowSuccessNotification(timer);
    } catch (error) {
      setErorNotifications(true);
      setErrorNotifiy('notifications errornotifiy')
      const timer = setTimeout(() => {
        setErorNotifications(false);
        setErrorNotifiy('');
      }, 2000);
      setErorNotifications(timer);
      console.error(error);
    } finally {
      setLoading(false);
      router.reload();
    }
  };

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
            setusers(data);
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
        seterrorLoading(false);
      }
    };

    if (userstorID) {
      fetchUserData();
    }
  }, []);

  if (setloading) {
    return <div className='text-white text-2xl mt-4'>Loading...</div>;
  }

  if (error) {
    return <div className='profile-error text-white'>Error: {error}</div>;
  }

  const handleImageClick = () => {
    const fileInput = document.getElementById('editImageInput');
    fileInput.click();
  };


  const labelClass = 'mb-4 text-base font-semibold leading-6 text-gray-900';
  const inputClass = 'block mb-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6';


  return (
    <div>
      <div className="main-users">
        <Container>
          {lightboxOpen && (
            <Lightbox
              mainSrc={users[lightboxIndex].profileimage}
              onCloseRequest={closeLightbox}
            />
          )}

          <div className='flex main-profile-grid'>
            <div key={id} className={`w-1/2 rounded-md  table-row profile-data ${profileinrclass}`}>
              <div className='user-title-name mb-4 text-2xl'>Admin Profile</div>
              <div className='main-profile-image text-center'>
                <div className='relative profile-imge'>
                  <Picture
                    src={userData.profileimage || 'https://ssbackend.swancreate.com/public/images/1702359051132-empty.avif'}
                    alt={id}
                    width="100"
                    height="100"
                    LogoClass="rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image"
                  />
                  <FontAwesomeIcon className='text-white camra-icon mt-8' onClick={() => handleEdituser(userData.id)} icon={faCamera} />
                </div>
                <div className="table-buttons">
                  <button className="edit-user rounded-md" onClick={() => handleEdituser(userData.id)}>
                    Edit
                  </button>
                  <button className="delete-user rounded-md" onClick={() => handleDeleteuser(userData.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className='user-bio'>
                <div className="usercontent">
                  <Heading level='5' headingText={editedUser || userData.username} />
                  <Paragraph ParagraphText={userData.email} />
                </div>

              </div>
            </div>
            <div key={id} className={`w-1/2 rounded-md table-row profile-data ${profileinrclass}`}>
              <div className='user-title-name mb-4 text-2xl'>Contact Info</div>
              <div className='px-8'>
                <div className='bio-contn'>
                  <Paragraph ParagraphText={`District:  ${userData.district}`} />
                  <Paragraph ParagraphText={`Location:  ${editedLocation || userData.location}`} />
                </div>
              </div>
            </div>
          </div>
          {editinguser && (
            <div className='form-reg' id='headlessui-dialog-:r6:'>
              <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>
              <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                  <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className='close-frm-icon'>
                      <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
                    </div>
                    <Heading level='4' headingText='Edit user' />
                    <div className="current-image-container">
                      <Image onClick={handleImageClick} width="100" height="100" htmlFor="editImageInput"
                        src={editedImage} alt="Current" className="edit-icon current-image" />
                      <label htmlFor="editImageInput" className={`${labelClass} edit-icon`} disabled={loading}>
                        {imageloading ? 'Image Uploaded Done' : 'Change Image'}
                      </label>
                      <input
                        id="editImageInput"
                        type="file"
                        className={inputClass}
                        src="{editinguser.profileimage}"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                    </div>
                    <label>
                      <span className={labelClass}>User Name</span>
                      <input
                        type="text"
                        className={inputClass}
                        required
                        placeholder="Your Name"
                        value={editedUser}
                        onChange={(e) => setEditedUser(e.target.value)}
                      />
                    </label>

                    <label>
                      <span className={labelClass}>Your Email Address</span>
                      <input
                        placeholder="Your Email Address"
                        required
                        className={inputClass}
                        type='email'
                        value={editedEmail}
                        onChange={(e) => seteditedEmail(e.target.value)}
                      />
                    </label>
                    <label>
                      <span className={labelClass}>Your Location</span>
                      <input
                        placeholder="Your Location"
                        required
                        className={inputClass}
                        type='email'
                        value={editedLocation}
                        onChange={(e) => seteditedLocation(e.target.value)}
                      />
                    </label>
                    <button className='inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25' onClick={handleUpdateuser} disabled={loading}>
                      {loading ? ' Updating...' : ' Update user'}
                    </button>
                    {showNotificationSuccess && (
                      <Notification
                        className={notifications}
                        message='Update Successful!'
                      />
                    )}
                    {showErorNotifications && (
                      <Notification
                        className={errornotifiy}
                        message=' Please try again '
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


        </Container>
      </div>

    </div>

  );
};

export default AdminProfile;
