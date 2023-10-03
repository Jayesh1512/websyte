import React from 'react'
import photo from '/img.jpg'
import './App.css'
function Photo() {
  return (
    <div className='photo'>
      <img src={photo} alt="" className='image'/>
    </div>
  )
}

export default Photo
