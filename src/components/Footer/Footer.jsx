import React from 'react'
import Container from '../Container/Container';

function Footer({mainftrclass, titleclass}) {
  return (
      <div className={mainftrclass}>
        <Container>
            <p className={titleclass}>Copyright@ School Nutrition</p>
        </Container>
      </div>
  )
}

export default Footer
