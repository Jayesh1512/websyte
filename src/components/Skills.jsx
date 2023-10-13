import React from 'react'
import Skeel from './Skeel'


function Skills() {

    const arr = [
        {
            name : "HTML",
            img : "/html.png"},
        {
            name : "CSS",
            img : "/css.png",
        },
        {
            name : "REACT",
            img : "/atom.png",
        },
        // {
        //     name : "BLENDER",
        //     img : "/blender.png",
        // },
        
    ]


  return (
    
      <div className="w-full min-h-screen mt-20 gap-8  grid lg:grid-cols-3 md:grid-cols-2 justify-items-stretch max-md:justify-center justify-between items-center md:px-8">
					{arr.map((p, i) => {
						return <Skeel key={i} name={p} />;
					})}
				</div>

  )
}

export default Skills
