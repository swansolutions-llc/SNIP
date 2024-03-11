import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import '../app/globals.css';
import '../src/assets/css/style.css';
import Container from '../src/components/Container/Container';
import DonationForm from '../src/components/DonationsForm/DonationForm';
import '../src/assets/css/donation.css'


// const stripePromise = loadStripe('pk_test_51NFK1lAUwwYwXNftLaAktClsnsv3MutgY0O47oNIUKSPfYQTnhDNK8sFt4KvfdAKmtVzASYWZHjLUmwdPNbTPX6h00gmBxw5Vn');
const stripePromise = loadStripe('pk_live_51Jrtq9KygXTmRDtKzBptr3dSFXRxOqrCrIoqADheolpj2Aq5xPPQ9hNYxseFBWZEwxERiwMkS2GmxHqrF6h9hVrm00iW7D8H9n');

export default function Donation() {
  return (
    <div className='register-login-panel flex items-center justify-center min-h-screen'>
      <Container>
        <div className='register-panel rounded-md'>
          <Elements stripe={stripePromise}>
            <DonationForm/>
          </Elements>

        </div>
      </Container>
    </div>
  );
}
