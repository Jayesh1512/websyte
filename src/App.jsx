import React, { useEffect } from 'react'
import './App.css'
import Photo from './Photo'
import Content from './components/Content'

import Left from './components/Left'
import DotRing from './components/DotRing'



function App() {
 
  return (
    <div className='content lg:flex ' >
     <DotRing />
      
     {/* LEFT */}
      <div className=' w-screen h-screen content lg:fixed lg:w-1/2'>
        <Left />
      </div>
      

      
      
      
      {/* Right */}
      
      <div className=' w-screen h-screen bg-slate-400 lg:w-1/2 lg:absolute lg:right-0'>
        <Photo />
        <Content />
      </div>
      
    </div>
  )
}

export default (App)
