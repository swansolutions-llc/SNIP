// components/SignUp.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../../../app/globals.css'
import Logo from '../../atoms/logo';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link'




const DonationForm = () => {
    const [name, setUsername] = useState('');
    const [district, setDistrict] = useState('');
    const [donor_image, setDonorImage] = useState('');
    const [donation_amount, setDonorAmount] = useState('');
    const [messagesuccess, setMessageSuccess] = useState('');
    const [messageerror, setMessageError] = useState('');
    const [loading, setLoading] = useState(false);
    const border = 'border-2 rounded-md';
    const margin = 'input-margin';
    const button = 'w-auto bg-violet-600 text-white px-4 mb-4 p-2 rounded hover:bg-violet-900';
    const history = useRouter();
    const [notificlass, setNotifyClass] = useState();
    const [erronotificlass, setErrorNotifyClass] = useState();
    const [useSiteLogo, setUseSiteLogo] = useState(false); // State to track whether to use site logo
    const [logoUrl, setLogoUrl] = useState('https://demo.schoolnutritionindustryprofessionals.com/images/SNIP_Logo-1.png'); // Default logo URL


    // Stripe

    const stripe = useStripe();
    const elements = useElements();

    const cardElementOptions = {
        hidePostalCode: true,
    };


    //   Add Image

    // const handleImageChanged = (e) => {
    //     const file = e.target.files[0];
    //     setDonorImage(file);
    //   };

    const handleCheckboxChange = () => {
        setUseSiteLogo(!useSiteLogo); // Toggle the state of using site logo
        if (!useSiteLogo) {
            // If the checkbox is checked, fill the file input with the site logo URL
            setDonorImage(logoUrl);
            console.log(logoUrl)
        } else {
            // If the checkbox is unchecked, clear the file input
            setDonorImage('');
        }
    };

    // Donations send
    const handleDonor = async (e) => {
        setMessageSuccess(null)
        setMessageError(null)
        setNotifyClass(null);
        setErrorNotifyClass(null);

        e.preventDefault();
        setLoading(true);

        try {
            const { token, error } = await stripe.createToken(elements.getElement(CardElement));
            console.log(token);
            if (error) {
                throw new Error(error.message);
            }
            let imagePath = ''; 

            if (!useSiteLogo) {
                // If checkbox is not checked, proceed with image upload
                const formData = new FormData();
                formData.append('image', donor_image);
                // Upload image to the server
                const imageresponse = await axios.post('https://api.schoolnutritionindustryprofessionals.com/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imagePath = "https://api.schoolnutritionindustryprofessionals.com/" + imageresponse.data.imagePath;
            }else {
                imagePath= logoUrl
            }
            const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/donation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, district, donor_image: imagePath, donation_amount, stripeToken: token.id, }),
            });
            if (response.ok) {

                setNotifyClass('notifications');
                setMessageSuccess('Donation Submit Successfully');
                const timer = setTimeout(() => {
                    setNotifyClass('');
                    setMessageSuccess('');
                }, 2000);
                timer;
                history.push(`https://scc.schoolnutritionindustryprofessionals.com/donation`);
            } else {
                setNotifyClass('notifications');
                setErrorNotifyClass('notifications errornotifiy')
                console.error('Failed to register user');
                setMessageError('Failed to Donation Submit. Please try again.');
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
            setMessageError('Failed to Donation Submit. Please try again.');
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



    return (
        <div className="sign-up-form max-w-md rounded-md flex justify-center">
            <div className="shadow-md ">
                <h1 className={`title-signup text-2xl text-center font-bold mb-4`}>Donation Form</h1>
                <div className='signup-logo-snip flex mb-8 justify-center'>
                    <Link href='/'><Logo src="/images/SNIP_Logo-1.png"
                    />
                    </Link>
                </div>

                <form onSubmit={handleDonor}>
                    <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Your Name
                    <input required
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full p-2 ${border} ${margin}`}
                    />
                    </label>
                    <label className='mb-4 text-base font-semibold leading-6 text-gray-900'>Your District/Company
                    <input required
                        type="text"
                        placeholder="District/Company"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={`w-full p-2 ${border} ${margin} `}
                    />
                    </label>
                    <label className='flex full-day-radio text-base font-semibold leading-6 text-gray-900 items-center gap-4 mb-4'>
                        Use Site Logo
                        <input type="checkbox" checked={useSiteLogo} onChange={handleCheckboxChange} />
                    </label>
                    {!useSiteLogo && ( 
                        <div>
                            <label htmlFor='file' className='mb-4 text-base font-semibold leading-6 text-gray-900'> Donor Picture
                            <input
                                type="file"
                                placeholder="Donor Image"
                                className={`w-full p-2 ${border} ${margin} `}
                                onChange={(e) => setDonorImage(e.target.files[0])}
                            />
                            </label>
                        </div>
                    )}
                    <label className='donation-field mb-4 text-base font-semibold leading-6 text-gray-900 mb-4'>Donation Amount
                        <input required
                            type="number"
                            placeholder="Donation Amount"
                            value={donation_amount}
                            onChange={(e) => setDonorAmount(e.target.value)}
                            className={`w-full p-2 ${border} ${margin} `}
                        />
                    </label>
                    <label>
                        <span className='mb-4 text-base font-semibold leading-6 text-gray-900'>Payment</span>
                        <CardElement options={cardElementOptions} className={`w-full p-2 ${border} ${margin} `} />
                    </label>

                    <button className={button} type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Donation'}
                    </button>
                </form>
                <p className={`${notificlass} m-4 rounded-md`}>{messagesuccess}</p>
                <p className={`${erronotificlass} m-4 rounded-md`}>{messageerror}</p>
            </div>
        </div>
    );
};

export default DonationForm;