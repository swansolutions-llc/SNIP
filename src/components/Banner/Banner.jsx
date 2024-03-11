import React from 'react'
import Container from '../Container/Container';



function Banner({bannerclass, bnrinrclass, bnrrclass, titleclass, bnrtitle, paragraphclass, bnrparagraph, bnrleftclass, bnrleftcont}) {
  return (


    <div className={bannerclass}>
        <Container>
            <div className={bnrinrclass}>
                <div className={bnrrclass}>
                    <h1 className={titleclass}>{bnrtitle}</h1>
                    <p className={paragraphclass}>{bnrparagraph}</p>
                </div>
                <div className={bnrleftclass}>
                    {bnrleftcont}
                </div>
            </div>
        </Container>
      
    </div>
  )
}

export default Banner
