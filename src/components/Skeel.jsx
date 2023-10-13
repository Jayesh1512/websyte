import React from 'react'

function Skeel(props) {
  return (
    <div className='w-full h-full'>
        <p className=' text-center text-2xl mb-4 font-bold text-bg-purple'>{props.name.name}</p>
      <img src={props.name.img} alt="" className="object-contain max-h-40" />
    </div>
  )
}

export default Skeel
