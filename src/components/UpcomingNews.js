import React from 'react'

function UpcomingNews(props) {
  return (
    <>
      <div
        className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4 text-center"
        data-aos="zoom-y-out"
      >
        {props.explorer
          ? 'Fantom Name Service Explorer'
          : 'Fantom Name Service Browser'}
      </div>
      <div
        className="text-xl md:text-xl text-center max-w-md m-auto mt-4 mb-8 py-10 px-5"
        data-aos="zoom-y-out"
        data-aos-delay="150"
      >
        {props.explorer
          ? 'explorer integration launching soon'
          : 'Browser will live on the 20th of October 2022.'}
      </div>
    </>
  )
}

export default UpcomingNews
