import React from 'react'
import dynamic from "next/dynamic";
import Link from 'next/link';
const Picture = dynamic(() => import('../../atoms/Image'))
const Heading = dynamic(() => import('../../atoms/Heading'))
const Paragraph = dynamic(() => import('../../atoms/Paragraph'))


function HeroSection({ mainherclass, heroinrclass, bnrbgclass1, bnrbgclass2, h1, p1, h3, tb, leftimg, leftimgclass, width, height }) {

  const bgsvg = {
    width: '100%',
    height: '100%',
    fill: '#A2BC61',
  };

  return (
    <div className={mainherclass}>
      <div className="container mx-auto relative flex">
        <div className={heroinrclass}>
          <div>
            <Heading level='1' headingText={h1} />
            <Paragraph ParagraphText={p1} />
            <div className="main_social_icon">
              <div className='social_icon flex gap-4'>
                <Link href='' className='flex justify-between items-center gap-8'>
                  <Heading level='3' headingText={h3} />
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M17.525,9H14V7c0-1.032,0.084-1.682,1.563-1.682h1.868v-3.18C16.522,2.044,15.608,1.998,14.693,2 C11.98,2,10,3.657,10,6.699V9H7v4l3-0.001V22h4v-9.003l3.066-0.001L17.525,9z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <p>{tb}</p>
          </div>
          <div className={`${leftimgclass} flex-shrink-0 ml-8`} >
            <div className=''>
              <Picture src={leftimg} alt="Side Image" width={width} height={height} LogoClass="object-cover" />
            </div>
            <div className={bnrbgclass1}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" preserveAspectRatio="xMidYMid meet" style={bgsvg}><circle cx="50" cy="50" r="50" fill="#5376d6"></circle></svg>
            </div>
            <div className={bnrbgclass2}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" preserveAspectRatio="xMidYMid meet" style={bgsvg}><circle cx="50" cy="50" r="50" fill="#6684d6"></circle></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;