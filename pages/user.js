import React from 'react'
import '../app/globals.css'
import '../src/assets/css/style.css'
import dynamic from "next/dynamic"; 
const Container = dynamic(()=> import('../src/components/Container/Container'))
const SignUp = dynamic(()=> import('../src/components/SignUp/SignUp'))
const Login = dynamic(()=> import('../src/components/Login/Login'))

function login() {
  const flex ='flex item-center justify-center gap-4 py-12';
  return (
    <div className='bg-gray-100'> 
      <Container>
        <div className={`inr-login ${flex}`}>
          <Login/>
          <SignUp/>
        </div>
      </Container>
    </div>
  )
}

export default login
