import React from 'react'
import '../app/globals.css'
import '../src/assets/css/style.css'
import dynamic from "next/dynamic"; 
const Header = dynamic(()=> import('../src/components/Header/Header'))
const Footer = dynamic(()=> import('../src/components/Footer/Footer'))
const Users = dynamic(()=> import('../src/components/GetUsers/Users'))





function alluser() {


  return (
    <div>
      <Header
        mainhdrclass='p-4 bg-gray-800 border-b-2 mb-4 main-header'
        titleclass='text-white text-2xl'
        hdrinrclass = 'flex justify-between items-center'
      />
      <Users tablerow = 'text-black hover:text-black hover:bg-gray-50'/>
      <Footer
        mainftrclass='p-4 text-center bg-gray-800 border-b-2 main-ftr'
        titleclass='text-white text-2xl'
      />
    </div>
  )
}

export default alluser
