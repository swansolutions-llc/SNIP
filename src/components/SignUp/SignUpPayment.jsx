// components/SignUp.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../../../app/globals.css'
import Logo from '../../atoms/logo';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link'
// import Select from 'react-select'
import Creatable from 'react-select/creatable';




const SignUpPayment = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [userdistrict, setUserDistrict] = useState([]);
  const [location, setLocation] = useState('');
  const [messagesuccess, setMessageSuccess] = useState('');
  const [messageerror, setMessageError] = useState('');
  const [loading, setLoading] = useState(false);
  const border = 'border-2 rounded-md';
  const margin = 'input-margin';
  const button = 'w-auto bg-violet-600 text-white px-4 mb-4 p-2 rounded hover:bg-violet-900';
  const history = useRouter();
  const [notificlass, setNotifyClass] = useState();
  const [erronotificlass, setErrorNotifyClass] = useState();
  const [districtid, SetDID] = useState();
  const [usernewid, setUserNewID] = useState();
  const [createDistrict, setCustomDistrict] = useState('');

  // Stripe

  const stripe = useStripe();
  const elements = useElements();
  
  const cardElementOptions = {
    hidePostalCode: true,
  };


  // Fetch District

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


  const handleChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setCustomDistrict('')
      const selectedDId = selectedOption.value;
      const selectedUser = userdistrict.find(user => user.id === parseInt(selectedDId, 10));
  
      if (selectedUser) {
        SetDID(selectedDId);
        setDistrict(selectedUser.d_name);
        console.log('Selected User ID:', selectedDId);
        console.log('Selected District:', selectedUser.d_name);
      } else if(!selectedUser) {
        setDistrict(selectedOption.value);
        setCustomDistrict('Create District')
      } else {
        console.error('District not found for ID:', selectedDId);
      }
    } else {
      console.error('Invalid selected option:', selectedOption);
    }
  };
  
  



  // Signup
  const handleSignup = async (e) => {
    setMessageSuccess(null)
    setMessageError(null)
    setNotifyClass(null);
    setErrorNotifyClass(null);

    e.preventDefault();
    setLoading(true);
      

    try {
      // const { token, error } = await stripe.createToken(elements.getElement(CardElement));
      // console.log(token); 
      // if (error) {
      //   throw new Error(error.message);
      // }
      const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, district, location, d_id: districtid }),
        // body: JSON.stringify({ username, email, password, district, location, d_id: districtid, stripeToken: token.id, }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserNewID(data.userId);

        if (createDistrict !== 'Create District') {
          console.log('successs')
        }else if(createDistrict === 'Create District') {
          const districtData = {
            d_name: district
          };
          try {
            const disresponse = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/usersignupdistrict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(districtData), // Pass districtData directly in body
            });
            if (!disresponse.ok) {
              throw new Error('Failed to create district');
            }
            const districtupdateData = await disresponse.json();
            const newDistrictId = districtupdateData.userId;
            const districtFetchID = {
              d_id : newDistrictId
            }
            await axios.put(`https://api.schoolnutritionindustryprofessionals.com/api/signuserupdate/${data.userId}`, districtFetchID)
            // Proceed with further processing using districtupdateData
          } catch (error) {
            console.error('Error creating district:', error);
            // Handle error appropriately
          }
          }
        setNotifyClass('notifications');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setMessageSuccess('Sign Up Successfully');
      const timer = setTimeout(() => {
          setNotifyClass('');
          setMessageSuccess('');
          history.push(`/profile/${data.userId}`);
        }, 2000);
        timer;
      } else if (response.status === 409) {
        setNotifyClass('notifications');
        setErrorNotifyClass('notifications errornotifiy')
        setMessageError('This email or name is already exists');
        const timer = setTimeout(() => {
          setNotifyClass('');
          setErrorNotifyClass('');
          setMessageError('');
        }, 3000);
        timer;
      } else {
        setNotifyClass('notifications');
        setErrorNotifyClass('notifications errornotifiy')
        console.error('Failed to register user');
        setMessageError('Failed to Sign Up. Please try again.');
        const timer = setTimeout(() => {
          setNotifyClass('');
          setErrorNotifyClass('');
          setMessageError('');
        }, 3000);
        timer;
      }
    } catch (error) {
      setNotifyClass('notifications');
      setErrorNotifyClass('notifications errornotifiy')
      console.error('Error:', error);
      setMessageError('Failed to Sign Up. Please try again.');
      const timer = setTimeout(() => {
        setNotifyClass('');
        setErrorNotifyClass('');
        setMessageError('');
      }, 3000);
      timer;
    } finally {
      setLoading(false);
    }
  };

  const options = userdistrict.map(user => ({
    value: user.id,
    label: user.d_name
  }));
  
  return (
    <div className="sign-up-form max-w-md rounded-md flex justify-center">
      <div className="shadow-md ">
        <h1 className={`title-signup text-2xl text-center font-bold`}>Create Your Account</h1>
        <h2 className='text-center mb-8 text-xl'>Sign up with your name, email address and password</h2>
        <div className='signup-logo-snip flex mb-8 justify-center'>
          <Link href='/'><Logo src="/images/SNIP_Logo-1.png"
          />
          </Link>
        </div>

        <form onSubmit={handleSignup}>
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>User Name</label>
          <input required
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 ${border} ${margin}`}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Email Address</label>
          <input required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>School/District</label>
          {/* <select
            className={`w-full p-2 ${border} ${margin}`}
            onChange={handleChange}
          >
            <option value="">Please Select School/District</option>
            {userdistrict && Array.isArray(userdistrict) && userdistrict.map((user) => (
              <option key={user.id} value={user.id}>{user.d_name}</option>
            ))}
          </select> */}
          <Creatable 
            className='snip-select-district'
            options={options} 
            isClearable
            required
            onChange={handleChange}
          />

          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Location</label>
          <input required
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Password</label>
          <input required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 ${border} ${margin} `}
          />
          {/* <label>
            <span className='mb-4 text-base font-semibold leading-6 text-gray-900'>Payment</span>
            <CardElement options={cardElementOptions}  className={`w-full p-2 ${border} ${margin} `}/>
          </label> */}

          <button className={button} type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className={`${notificlass} m-4 rounded-md`}>{messagesuccess}</p>
        <p className={`${erronotificlass} m-4 rounded-md`}>{messageerror}</p>
        <div className='login-event pt-0'>
          <p>Already have an account? <span><Link href='/login'> Log in now. </Link></span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPayment;