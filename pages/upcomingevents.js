import React, {useEffect} from 'react'
import '../app/globals.css'
import { useRouter } from 'next/router';
import dynamic from "next/dynamic"; 
const Footer = dynamic(()=> import('../src/components/Footer/Footer'))
const Header = dynamic(()=> import('../src/components/Header/Header'))
const ComingEvents = dynamic(()=> import('../src/components/Events/ComingEvents'))

function UpcomingEvents() {
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
    <ComingEvents/>
    <Footer
        mainftrclass='p-4 text-center bg-gray-800 border-b-2 main-ftr'
        titleclass='text-white text-2xl'
      />
    </>
  )
}

export default UpcomingEvents
