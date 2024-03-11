// components/SignUp.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import '../../../app/globals.css'
import axios from 'axios';


const AddNewCommunityPhone = () => {
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');
  const [C_email, setEmail] = useState('');
  const [C_company, setCompany] = useState('');
  const [C_title, setTitle] = useState('');
  const [C_phone, setPhone] = useState('');
  const [C_address, setAddress] = useState('');
  const [C_city, setCity] = useState('');
  const [C_state, setState] = useState('');
  const [C_zipcode, setZipCode] = useState('');
  const [C_website, setWebsite] = useState('');

  const [messagesuccess, setMessageSuccess] = useState('');
  const [messageerror, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const border = 'border-2 rounded-md';
  const margin = 'input-margin';
  const button = 'dist-add w-auto bg-violet-600 text-white px-4 mb-4 p-2 rounded hover:bg-violet-900';
  const history = useRouter();
  const [notificlass, setNotifyClass] = useState();
  const [erronotificlass, setErrorNotifyClass] = useState();


  // Submit District
  const handleAddDistrict = async (e) => {
    setMessageSuccess(null)
    setMessageError(null)
    setNotifyClass(null);
    setErrorNotifyClass(null);
    e.preventDefault();
    setLoading(true);
    try {
      // Send data to adddistrict endpoint
      await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/addcommunityphonebook', {
        f_name: f_name,
        l_name: l_name,
        email: C_email,
        company: C_company,
        title: C_title,
        address: C_address,
        city: C_city,
        state: C_state,
        zip_code: C_zipcode,
        phone: C_phone,
        website: C_website,
      });

      setNotifyClass('notifications');
      setMessageSuccess('Add Community Phone Book Successfully');
      const timer = setTimeout(() => {
        setFName('');
        setLName('');
        setEmail('');
        setCompany('');
        setTitle('');
        setPhone('');
        setAddress('');
        setCity('');
        setState('');
        setZipCode('');
        setWebsite('');
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
      setMessageError('Failed to Add Community Phone Book. Please try again.');
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="full_form sign-up-form max-w-md rounded-md flex justify-center">
      <div className="shadow-md ">
        <h1 className={`mb-12 text-2xl text-center font-bold`}>Create a New Community Phone Book</h1>
        <form onSubmit={handleAddDistrict}>
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>First Name</label>
          <input required
            type="text"
            placeholder="First Name"
            value={f_name}
            onChange={(e) => setFName(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Last Name</label>
          <input required
            type="text"
            placeholder="Last Name"
            value={l_name}
            onChange={(e) => setLName(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Email Address</label>
          <input required
            type="email"
            placeholder="Email"
            value={C_email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Company Name</label>
          <input required
            type="text"
            placeholder="Company Name"
            value={C_company}
            onChange={(e) => setCompany(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Title</label>
          <input required
            type="text"
            placeholder="Title"
            value={C_title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Phone</label>
          <input required
            type="text"
            placeholder="Phone"
            value={C_phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Address</label>
          <input required
            type="text"
            placeholder="Address"
            value={C_address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>City</label>
          <input required
            type="text"
            placeholder="City"
            value={C_city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>State</label>
          <input required
            type="text"
            placeholder="State"
            value={C_state}
            onChange={(e) => setState(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Zip Code</label>
          <input required
            type="text"
            placeholder="Zip Code"
            value={C_zipcode}
            onChange={(e) => setZipCode(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Website URL</label>
          <input required
            type="text"
            placeholder="Website URL"
            value={C_website}
            onChange={(e) => setWebsite(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />

          <button className={button} type="submit" disabled={loading}>
            {loading ? 'Submiting ...' : 'Add New Communty Phone Book'}
          </button>
        </form>
        <p className={`${notificlass} m-4 rounded-md`}>{messagesuccess}</p>
        <p className={`${erronotificlass} m-4 rounded-md`}>{messageerror}</p>
      </div>
    </div>
  );
};

export default AddNewCommunityPhone;