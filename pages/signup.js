import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import '../app/globals.css';
import '../src/assets/css/style.css';
// import dynamic from 'next/dynamic';
// const Container = dynamic(() => import('../src/components/Container/Container'));
import Container from '../src/components/Container/Container';
import SignUpPayment from '../src/components/SignUp/SignUpPayment';


// Replace 'your-publishable-key' with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51NFK1lAUwwYwXNftLaAktClsnsv3MutgY0O47oNIUKSPfYQTnhDNK8sFt4KvfdAKmtVzASYWZHjLUmwdPNbTPX6h00gmBxw5Vn');

export default function Signup() {
  return (
    <div className='register-login-panel flex items-center justify-center min-h-screen'>
      <Container>
        <div className='register-panel rounded-md'>
          <Elements stripe={stripePromise}>
            <SignUpPayment />
          </Elements>

        </div>
      </Container>
    </div>
  );
}
