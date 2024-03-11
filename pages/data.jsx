// Getuser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Picture from '../src/atoms/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Notification from '../src/atoms/Notification';
import Container from '../src/components/Container/Container'
import { useRouter } from 'next/router';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import 'datatables.net-dt/css/jquery.dataTables.css';

const Getuser = ({ userId }) => {
  const [users, setusers] = useState([]);
  const [editinguser, setEditinguser] = useState(null);
  const [editedUser, setEditedUser] = useState('');
  const [editedEmail, seteditedEmail] = useState('');
  const [showNotificationSuccess, setShowSuccessNotification] = useState(false);
  const [showErorNotifications, setErorNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedImage, setEditedImage] = useState('');
  const [imagechanged,setimagechanged]= useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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
    setimagechanged(true)
  };
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get(`https://api.schoolnutritionindustryprofessionals.com/api/eventsusers/`);
        setusers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchusers();
  }, [userId]);


  const handleDeleteuser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://api.schoolnutritionindustryprofessionals.com//api/delete/${userId}`);
        const updatedusers = users.filter((user) => user.id !== userId);
        setusers(updatedusers);
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
    seteditedEmail(userToEdit.email)
    setEditedImage(userToEdit.profileimage); // Add this line
  };

  const handleUpdateuser = async () => {
    try {
      var imagePath;
      setLoading(true);
      if(imagechanged==true){
      const formData = new FormData();
      formData.append('image', editedImage);
      const response = await axios.user('https://api.schoolnutritionindustryprofessionals.com/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    imagePath = "https://api.schoolnutritionindustryprofessionals.com" + response.data.imagePath;
    }
    else{
      imagePath=editedImage
    }
      await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/useredit/${editinguser.id}`, {
        username: editedUser,
        email: editedEmail,
        profileimage: imagePath
      });
      const updatedusers = users.map((user) =>
        user.id === editinguser.id ? { ...user, username: editedUser, email: editedEmail, profileimage: imagePath } : user
      );
      setusers(updatedusers);
      setShowSuccessNotification(true);
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setEditinguser(null);
      }, 2000);
      setShowSuccessNotification(timer);
    } catch (error) {
      setErorNotifications(true);

      const timer = setTimeout(() => {
        setErorNotifications(false);
      }, 2000);
      setErorNotifications(timer);
      console.error(error);
    } finally {
      setLoading(false); // Reset loading state regardless of the outcome
    }
  };

//Data Table


  
  return (
    <div className="main-users">
      <Container>
      {lightboxOpen && (
        <Lightbox
          mainSrc={users[lightboxIndex].profileimage}
          onCloseRequest={closeLightbox}
        />
      )}
        <div className="participantdata">
            {users.length === 0 ? (
              <p>No data available in table</p>
            ) : (
            users.map((user, index) => (
                <div key={user.id} className="table-row">
                    {/* <img src={user.profileimage} alt={user.username} className="table-image" /> */}
                    <Picture
                      src={user.profileimage || 'https://ssbackend.swancreate.com/public/images/1702359051132-empty.avif'}
                      alt={user.id}
                      className="table-image"
                      onClick={() => openLightbox(index)}
                    />
                    <div className="table-content">
                      <p>{user.username}</p>
                    </div>
                    <div className="table-content">
                      <p>{user.email}</p>
                    </div>
                    <div className="table-buttons">
                      <button className="edit-user" onClick={() => handleEdituser(user.id)}>
                        Edit
                      </button>
                      <button className="delete-user" onClick={() => handleDeleteuser(user.id)}>
                        Delete
                      </button>
                    </div>
              </div>

              ))
              )}
        </div>
        {editinguser && (
          <div className='form-reg-he'>
            <div className="edit-main">
              <div className='close-frm-icon'>
                <FontAwesomeIcon onClick={closeeditform} icon={faTimes} />
              </div>
              <h2>Edit user</h2>
              <div className="current-image-container">
              <Picture src={editedImage} alt="Current" LogoClass="current-image" />
              <label htmlFor="editImageInput" className="edit-icon">
                Change Image
              </label>
              <input
                id="editImageInput"
                type="file"
                src="{editinguser.profileimage}"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

              {/* <label>
                <span>Giver Gallery Picture</span>
                <input src='{editedImage || editinguser.profileimage}' type="file"  onChange={handleImageChange} />
              </label> */}
              <label>
                <span>User Name</span>
                <input
                  type="text"
                  required
                  placeholder="Giver Name"
                  value={editedUser}
                  onChange={(e) => setEditedUser(e.target.value)}
                />
              </label>

              <label>
              <span>Giver Email</span>
                <input
                  placeholder="User Email Address"
                  required
                  type='email'
                  value={editedEmail}
                  onChange={(e) => seteditedEmail(e.target.value)}
                />
              </label>
              <button onClick={handleUpdateuser} disabled={loading}>
                {loading ? ' Updating...' : ' Update user'}
              </button>
              {showNotificationSuccess && (
                <Notification
                  className='success-notification'
                  message='Update Successful!'
                />
              )}
              {showErorNotifications && (
                <Notification
                  className='decline-notification'
                  message=' Please try again '
                />
              )}
            </div>
          </div>
        )}
        
        
      </Container>
    </div>
  );
};

export default Getuser;
