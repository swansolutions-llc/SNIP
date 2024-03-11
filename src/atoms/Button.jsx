import React from 'react'

function Button({DefaultButton, buttonText}) {
  return (
    <button className={DefaultButton}>
      {buttonText}
    </button>
  )
}

export default Button
