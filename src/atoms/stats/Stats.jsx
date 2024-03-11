import React from 'react'
import Picture from '../Image'

function Stats({mainstatsclass, statstitleclass, statsitclass, statstitle, statscontentclass, statstextclass, statsiconclass, statscount, statsiconhref}) {
  return (
    <div className={mainstatsclass}>
      <div className={statsitclass}>
        <div className={statstitleclass}>
            <h3>{statstitle}</h3>
        </div>
        <div className={statsiconclass}>
            <Picture src={statsiconhref} alt='' width="100" height="100" LogoClass=''/>
        </div>
      </div>
        <div className={statscontentclass}>
            <div className={statstextclass}>
                <h6>{statscount}</h6>
            </div>
        </div>

    </div>
  )
}

export default Stats
