import React from 'react'
import Login from '../src/components/Login/Login'
import '../app/globals.css'
import '../src/assets/css/style.css'
import Link from 'next/link'
import dynamic from "next/dynamic"; 
const Container = dynamic(()=> import('../src/components/Container/Container'))



function login() {
 
  return (
    <div className='flex items-center login-body justify-center min-h-screen'> 
      <Container>
        <div className='rounded-md login-panel'>
          <Login/>
        </div>
        
      </Container>
    </div>
  )
}

export default login
