import React, { useEffect } from 'react'
import './App.css'
import Photo from './Photo'
import Content from './components/Content'

import Left from './components/Left'



function App() {
 
  return (
    <div className='content flex'>
     
      
     {/* LEFT */}
      <div className='left w-1/2 h-screen content'>
        <Left />
      </div>
      

      
      
      
      {/* Right */}
      
      <div className='right w-1/2 h-screen bg-slate-400'>
        <Photo />
        <Content />
      </div>
      
    </div>
  )
}

export default (App)
