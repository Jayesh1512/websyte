import React from 'react'



function About() {
  return (
    <div className='pt-20 pb-20 pl-10 pr-10 min-h-screen reverse w-full flex justify-center items-center'>
    
      <div className=' h-5/6 lg:w-10/12 text-center -ml-3 lg:text-left'>
          <p className='text-bg-purple font-semibold text-4xl'>About me</p>

          <p className='text-bg-purple font-medium text-2xl mt-4'>I enjoy working closely with design teams to faithfully translate their designs right down to the last pixel. Daily, you'll find me using modern frontend technologies that bring the creative process to life just as designers intended them to be.</p>


          <p className='text-bg-purple font-semibold text-2xl mt-12'>Technical</p>

          <p className='text-bg-purple  text-lg mt-2'>Right now you can find me hacking away primarily with Three-JS ,React and in general anything JavaScript / TypeScript, HTML and CSS related.</p>


          <p className='text-bg-purple font-semibold text-2xl mt-8'>Personal</p>

          <p className='text-bg-purple  text-lg mt-2'>I grew up in Nagpur and .Being a huge football fan  I support Liverpool and Real Madrid. I speak Hindi and English . I prefer working at nights 😁 </p>

      </div>
      
      
    </div>

  )
}

export default(About);
