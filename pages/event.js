import React from 'react'
import '../app/globals.css';
import dynamic from "next/dynamic"; 
const Events = dynamic(()=> import('../src/components/Calendar/Events'))


function event() {
  return (
    <div>
      <Events/>
    </div>
  )
}

export default event
