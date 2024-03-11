import React, {useEffect} from 'react'
import { useRouter } from 'next/router';
import '../src/assets/css/style.css'
import '../app/globals.css'
import dynamic from "next/dynamic"; 
const AdminProfile = dynamic(()=> import('../src/components/Profile/AdminProfile'))
const Footer = dynamic(()=> import('../src/components/Footer/Footer'))
const Header = dynamic(()=> import('../src/components/Header/Header'))



function Profile() {

    const router = useRouter();
  
  useEffect(() => {
      const adminrole = localStorage.getItem('role');
      console.log(adminrole)
      if(adminrole !== 'admin' ){
        router.push('/')
      }else if (!adminrole){
        router.push('/login')
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
            <AdminProfile/>
        </div>
        <Footer
            mainftrclass='p-4 text-center bg-gray-800 border-b-2 main-ftr'
            titleclass='text-white text-2xl'
        />
    </>
  )
}

export default Profile
