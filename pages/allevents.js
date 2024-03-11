import React from 'react'
import '../app/globals.css'
import dynamic from "next/dynamic"; 
const AllEvents = dynamic(()=> import('../src/components/Events/AllEvents'))
const Footer = dynamic(()=> import('../src/components/Footer/Footer'))
const Header = dynamic(()=> import('../src/components/Header/Header'))


function allevents() {
  return (
    <>
      <Header
        mainhdrclass='p-4 bg-gray-800 border-b-2 main-header'
        titleclass='text-white text-2xl'
        hdrinrclass='flex justify-between items-center'
      />
      <AllEvents />
      <Footer
        mainftrclass='p-4 text-center bg-gray-800 border-b-2 main-ftr'
        titleclass='text-white text-2xl'
      />
    </>
  )
}

export default allevents
