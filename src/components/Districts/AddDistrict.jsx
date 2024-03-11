// components/SignUp.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import '../../../app/globals.css'
import axios from 'axios';


const AddDistrict = () => {
  const [d_name, setDistrict] = useState('');
  const [d_email, setEmail] = useState('');
  const [d_location, setLocation] = useState('');
  const [district_facebook, setDistrictFacebook] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [aboutus, setAboutUs] = useState('');

  const [messagesuccess, setMessageSuccess] = useState('');
  const [messageerror, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const border = 'border-2 rounded-md';
  const margin = 'input-margin';
  const button = 'dist-add w-auto bg-violet-600 text-white px-4 mb-4 p-2 rounded hover:bg-violet-900';
  const history = useRouter();
  const [notificlass, setNotifyClass] = useState();
  const [erronotificlass, setErrorNotifyClass] = useState();
  const [d_logo, setDistrictLogo] = useState('');
  const [d_cover, setDistrictCover] = useState('');


  const handleAddLogo = (e) => {
    const file = e.target.files[0];
    setDistrictLogo(file);
  };
  const handleAddCover = (e) => {
    const file = e.target.files[0];
    setDistrictCover(file);
  };

  

  // Submit District
  const handleAddDistrict = async (e) => {
    setMessageSuccess(null)
    setMessageError(null)
    setNotifyClass(null);
    setErrorNotifyClass(null);
    e.preventDefault();
    setLoading(true);
    try {
      const formDataLogo = new FormData();
      formDataLogo.append('logo', d_logo);

      const formDataCover = new FormData();
      formDataCover.append('cover', d_cover);

      // Upload logo
      const logoupload = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/logoupload', formDataLogo, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Upload cover
      const coverupload = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/coverupload', formDataCover, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Adding absolute URL into it
      const logoPath = "https://api.schoolnutritionindustryprofessionals.com/" + logoupload.data.logoPath;
      const coverPath = "https://api.schoolnutritionindustryprofessionals.com/" + coverupload.data.coverPath;

      // Send data to adddistrict endpoint
      await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/adddistrict', {
        d_name: d_name,
        d_email: d_email,
        d_location: d_location,
        district_facebook: district_facebook,
        phone: phone,
        state: state,
        logo: logoPath,
        cover: coverPath,
        aboutus: aboutus,
      });

      setNotifyClass('notifications');
      setMessageSuccess('Add District Successfully');
      const timer = setTimeout(() => {
        setNotifyClass('');
        setMessageSuccess('');
        setDistrict(''); 
        setEmail('');
        setLocation('');
        setDistrictFacebook('');
        setPhone('');
        setState('');
        setDistrictLogo('');
        setDistrictCover('');
        setAboutUs('');
        setNotifyClass('');
        setMessageError('');
      }, 4000);
      timer;
    } catch (error) {
      setNotifyClass('notifications');
      setErrorNotifyClass('notifications errornotifiy')
      const timer = setTimeout(() => {
        setNotifyClass('');
        setDistrict(''); 
        setEmail('');
        setLocation('');
        setDistrictFacebook('');
        setPhone('');
        setState('');
        setDistrictLogo('');
        setDistrictCover('');
        setAboutUs('');
        setNotifyClass('');
        setErrorNotifyClass('');
        setMessageError('');
      }, 4000);
      timer;
      console.error('Error:', error);
      setMessageError('Failed to Add District. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  



  return (
    <div className="full_form sign-up-form max-w-md rounded-md flex justify-center">
      <div className="shadow-md ">
        <h1 className={`mb-12 text-2xl text-center font-bold`}>Create a New District</h1>
        <form onSubmit={handleAddDistrict}>
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>School/District</label>
          <input required
            type="text"
            placeholder="Add District Name"
            value={d_name}
            onChange={(e) => setDistrict(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Email Address</label>
          <input required
            type="email"
            placeholder="Email"
            value={d_email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Location</label>
          <input required
            type="text"
            placeholder="District Location"
            value={d_location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Facebook Page URL</label>
          <input required
            type="text"
            placeholder="District Facebook URL"
            value={district_facebook}
            onChange={(e) => setDistrictFacebook(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Logo</label>
          <input required
            type="file"
            placeholder="District Logo"
            onChange={handleAddLogo}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Cover</label>
          <input required
            type="file"
            // value= {cover}
            placeholder="District Cover"
            onChange={handleAddCover}
            // onChange={(e) => setCover(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District State</label>
          <input required
            type="text"
            placeholder="District State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District Phone</label>
          <input required
            type="text"
            placeholder="District Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>District About Us</label>
          <textarea required
            type="textarea"
            placeholder="District About Us"
            value={aboutus}
            onChange={(e) => setAboutUs(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <button className={button} type="submit" disabled={loading}>
            {loading ? 'Submiting ...' : 'Add New District'}
          </button>
        </form>
        <p className={`${notificlass} m-4 rounded-md`}>{messagesuccess}</p>
        <p className={`${erronotificlass} m-4 rounded-md`}>{messageerror}</p>
      </div>
    </div>
  );
};

export default AddDistrict;