import React from 'react'
import html from '/html.png'
import Skeel from './Skeel'


function Skills() {

    const arr = [
        {
            title: "HTML",
            img : {html}

        },
    ]


  return (
    <div className='w-full h-screen '>
      {arr.map((p,i) =>{
        return <Skeel key = {i} obj = {p} />
      })}
    </div>
  )
}

export default Skills
