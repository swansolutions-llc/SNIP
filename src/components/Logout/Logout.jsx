import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router';

function Logout({LogoutText, LogoutClass}) {

    const handleLogout = () => {

        if (window.confirm('Are you sure you want to log out?')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            window.location.reload();
          }
        }
      };

  return (
    <a className={LogoutClass} onClick={handleLogout}>{LogoutText}</a>
  )
}

export default Logout
