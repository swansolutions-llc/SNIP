import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Button from '../../atoms/Button';
import Logo from '../../atoms/logo';
import Container from '../Container/Container';
import Picture from '../../atoms/Image';

function Header({ mainhdrclass, hdrinrclass }) {
  const router = useRouter();

  useEffect(() => {
    const adminRole = localStorage.getItem('role');
    if (adminRole == 'admin') {
      setIsAdmin(typeof window !== 'undefined' && localStorage.getItem('role'));
    }
    setIsLoggedIn(typeof window !== 'undefined' && localStorage.getItem('token'));
    setUserId(typeof window !== 'undefined' && localStorage.getItem('userId'));
  }, []);



  const [message, setMessage] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const menuclass = 'text-white text-2xl ml-4';
  const [notificlass, setNotifyClass] = useState();
  const [userData, setUserData] = useState();
  const [ProfileDetail, setProfileData] = useState();
  const [id, setId] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const submenuclass = 'px-2 rounded-md cursor-pointer hover:bg-gray-100 py-1 px-2';
  const [Role, setRole] = useState();
  const [error, setError] = useState();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('userId');
    const Role = localStorage.getItem('role');
    setId(storedToken)
    setRole(Role)
  }, [])


  // ... (previous code)

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedToken = localStorage.getItem('userId');
      const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/eventsuser/${id}`);
      if (response.ok) {
        const data = await response.json();
        const user = data.find((user) => user.id === Number(storedToken));

        if (user) {
          setUserData(user);
          setProfileData(
            <div className='relative profile-avatar-imge' onClick={handleProfileClick}>
              <div className="flex items-center">
                <Picture
                  src={user.profileimage || '/images/emptyprofile.avif'}
                  alt={id}
                  LogoClass="w-10 profile-avatar rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image cursor-pointer"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4 ml-2 rounde-md cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          );
        } else {
          setError('User not found');
        }
      } else {
        setError('Failed to fetch user data');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
    }
  };

  if (id && router) {
    fetchUserData();
  }
}, [id, router]); // Add dependencies here

// ... (remaining code)

  


  const handleProfileClick = (event) => {
    event.stopPropagation();
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };


  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);



  const handleLogout = () => {

    if (window.confirm('Are you sure you want to log out?')) {
      if (typeof window !== 'undefined') {
        setNotifyClass('notifications')
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setMessage('Logged out successfully');
        window.location.reload();
      }
    }
  };

  return (
    <div className={`relative ${mainhdrclass}`}>

      <Container>
        <div className={hdrinrclass}>
          <div className='hdrtitle'>
            <Link href='/'>
              <Logo src={isLoggedIn ? ("/images/SNIP_Logo-login.png") : "/images/SNIP_Logo_unlogin.png"}
              />
            </Link>
          </div>
          <nav className='navbar'>
                   
            {isAdmin ? (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href='/upcomingevents'>
                  Upcoming Events
                </Link>
                <Link className={menuclass} href={`/admin`}>
                  Admin Dashboard
                </Link>
                <a className={menuclass} onClick={handleLogout}>
                  Logout
                </a>
                <div>{ProfileDetail}</div>
                <p className={notificlass}>{message}</p>
              </>
            ) : isLoggedIn ? (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href='/upcomingevents'>
                  Upcoming Events
                </Link>
                <Link className={menuclass} href={`/profile/${userId}`}>
                  My Account
                </Link>
                <a className={menuclass} onClick={handleLogout}>
                  Logout
                </a>
                <div>{ProfileDetail}</div>
                <p className={notificlass}>{message}</p>
              </>
            ) : (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href="/login">
                  Login
                </Link>
                <Link className={menuclass} href="/signup">
                  Signup
                </Link>
                <Link className={menuclass} href="/contact">
                  Contact Us
                </Link>
              </>
            )}
            {showDropdown && (
              <div className={`profile-sub-menu absolute top-10 right-0 bg-white border border-gray-200 rounded shadow-md p-2 transform ${showDropdown ? 'translate-y-0' : 'translate-y-full'
                } transition-transform duration-300 ease-in-out`}
              >
                {Role === 'admin' ? (

                  <>
                    <div className='profile-details'>
                        <Link href={`/admin-profile`}>
                          <div className='rounded-md p-2 profile-details-inr hover:bg-gray-100'>
                            <Picture
                                src={userData.profileimage || '/images/emptyprofile.avif'}
                                alt={id}
                                width="100"
                                height="100"
                                LogoClass="w-10 profile-avatar rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image cursor-pointer"
                            />
                            <h4>{userData.username}</h4>
                          </div>
                          <Link className={submenuclass} href={`/admin-profile`}>
                            <Button
                              buttonText='Admin Profile'
                              DefaultButton='profile-btn rounded-md p-2'
                            />
                          </Link>
                        </Link>
                      </div>
                  </>
                  ) : (
                  <>
                      <div className='profile-details'>
                        <Link href={`/profile/${userId}`}>
                          <div className='rounded-md profile-details-inr hover:bg-gray-100'>
                            <Picture
                                src={userData.profileimage || '/images/emptyprofile.avif'}
                                alt={id}
                                width="100"
                                height="100"
                                LogoClass="w-10 profile-avatar rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image cursor-pointer"
                            />
                            <h4>{userData.username}</h4>
                          </div>
                          <Link className={submenuclass} href={`/userprofile/${userId}`}>
                            <Button
                              buttonText='User Profile'
                              DefaultButton='profile-btn rounded-md p-2'
                            />
                          </Link>
                        </Link>
                      </div>
                  </>
                  )}
                <a className={submenuclass} onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}

          </nav>
          
          {/* mobile menu */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <nav className={`mobile-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          
          {isMobileMenuOpen && (
            <>
            {isAdmin ? (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href='/upcomingevents'>
                  Upcoming Events
                </Link>
                <Link className={menuclass} href={`/admin`}>
                  Admin Dashboard
                </Link>
                <a className={menuclass} onClick={handleLogout}>
                  Logout
                </a>
                <div>{ProfileDetail}</div>
                <p className={notificlass}>{message}</p>
              </>
            ) : isLoggedIn ? (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href='/upcomingevents'>
                  Upcoming Events
                </Link>
                <Link className={menuclass} href={`/profile/${userId}`}>
                  My Account
                </Link>
                <a className={menuclass} onClick={handleLogout}>
                  Logout
                </a>
                <div>{ProfileDetail}</div>
                <p className={notificlass}>{message}</p>
              </>
            ) : (
              <>
                <Link className={menuclass} href="/">
                  Home
                </Link>
                <Link className={menuclass} href="/login">
                  Login
                </Link>
                <Link className={menuclass} href="/signup">
                  Signup
                </Link>
                <Link className={menuclass} href="/contact">
                  Contact Us
                </Link>
              </>
            )}
            {showDropdown && (
              <div className={`profile-sub-menu absolute top-10 right-0 bg-white border border-gray-200 rounded shadow-md p-2 transform ${showDropdown ? 'translate-y-0' : 'translate-y-full'
                } transition-transform duration-300 ease-in-out`}
              >
                {Role === 'admin' ? (

                  <>
                    <div className='profile-details'>
                        <Link href={`/admin-profile`}>
                          <div className='rounded-md profile-details-inr hover:bg-gray-100'>
                            <Picture
                              src={userData.profileimage || '/images/emptyprofile.avif'}
                              alt={id}
                              width="100"
                              height="100"
                              LogoClass="w-10 profile-avatar rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image cursor-pointer"
                            />
                            <h4>{userData.username}</h4>
                          </div>
                          <Link className={submenuclass} href={`/admin-profile`}>
                            <Button
                              buttonText='Admin Profile'
                              DefaultButton='profile-btn rounded-md p-2'
                            />
                          </Link>
                        </Link>
                      </div>
                  </>
                  ) : (
                  <>
                      <div className='profile-details'>
                        <Link href={`/profile/${userId}`}>
                          <div className='rounded-md p-2 profile-details-inr hover:bg-gray-100'>
                            <Picture
                              src={userData.profileimage || '/images/emptyprofile.avif'}
                              alt={id}
                              width="100"
                              height="100"
                              LogoClass="w-10 profile-avatar rounded-full ring-2 ring-gray-300 dark:ring-gray-500 table-image cursor-pointer"
                            />
                            <h4>{userData.username}</h4>
                          </div>
                          <Link className={submenuclass} href={`/profile/${userId}`}>
                            <Button
                              buttonText='User Profile'
                              DefaultButton='profile-btn rounded-md p-2'
                            />
                          </Link>
                        </Link>
                      </div>
                  </>
                  )}
                <a className={submenuclass} onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
            </>
            )}

          </nav>

        </div>
      </Container>
    </div>
  );
}

export default Header;
