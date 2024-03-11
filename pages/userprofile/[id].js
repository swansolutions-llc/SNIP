import React, {useEffect} from 'react'
import { useRouter } from 'next/router';
import '../../src/assets/css/style.css'
import '../../app/globals.css'
import Header from '../../src/components/Header/Header';
import Footer from '../../src/components/Footer/Footer';
import UserProfile from '../../src/components/Profile/UserProfile';

function Profile() {
    
    const router = useRouter();
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
        }
      }
    }, [router]);


  return (
    <>
        <Header
            mainhdrclass='p-4 bg-gray-800 border-b-2 main-header'
            titleclass='text-white text-2xl'
            hdrinrclass = 'flex justify-between items-center'
        />
        <div className='my-12'>
            <UserProfile/>
        </div>
        <Footer
            mainftrclass='p-4 text-center bg-gray-800 border-b-2 main-ftr'
            titleclass='text-white text-2xl'
        />
    </>
  )
}

export default Profile
