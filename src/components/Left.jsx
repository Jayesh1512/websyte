import React, { useEffect, useState } from 'react'
import image from '/photo.png'

function Left() {
    const [theme,setTheme] = useState('pink');

        useEffect(()=>{
            document.body.className = theme;
        },[theme])
    

    const yellowTheme = () =>{
        setTheme('yellow');
        
    }

    const greenTheme = () =>{
        setTheme('green');
       
    }

    const pinkTheme = () =>{
        setTheme('pink');
        
    }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-start lg:flex-row-reverse w-9/12 lg:ml-14 '>
        <div className='flex ml-8'>
            <button className='mt-20 w-10 h-10 rounded-full bg-text-pink grid place-content-center' onClick={pinkTheme}></button>
            <button className='ml-20 mt-20 w-10 h-10 rounded-full bg-text-yellow grid place-content-center' onClick={yellowTheme}></button>
            <button className='ml-20 mt-20 w-10 h-10 rounded-full bg-text-green grid place-content-center' onClick={greenTheme}></button>   
        </div>

        <div>
            <button className='mt-20 w-20 h-20 rounded-full reverse grid place-content-center p-3 lg:static fixed right-10 bottom-20 z-50 '>
              <img src={image} alt="" className='object-contain'/>
            </button>
        </div>
        
      </div>
 
        {/* Text */}
          <span className='h-2/5 mt-20  flex  flex-col items-center w-5/6   gap-10 '>
            <p className='font-main content text-5xl font-medium w-5/6'  >Hello. I'm a User Interface Develooper </p>
            <p className='font-main content text-lg w-5/6 font-normal' >My name is Jayesh Shete . I craft user interface using modern front end technology</p>
          </span>
    </div>
  )
}

export default Left
