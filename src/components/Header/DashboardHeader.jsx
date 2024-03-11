import React, {useState, useEffect, useRef} from 'react'
import Container from '../Container/Container';
import Logout from '../Logout/Logout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '../../atoms/Button';
import Picture from '../../atoms/Image'

function DashboardHeader() {
    const [id, setId] = useState();
    const [showDropdown, setShowDropdown] = useState(false);
    const submenuclass = 'px-2 rounded-md cursor-pointer hover:bg-gray-100 py-1 px-2';
    const [userData, setUserData] = useState();
    const [ProfileDetail, setProfileData] = useState();
    const router = useRouter();
    const [Role, setRole] = useState();


    useEffect(() => {
        const storedToken = localStorage.getItem('userId');
        const adminrole = localStorage.getItem('role');
        setRole(adminrole);
        setId(storedToken)
    }, []);


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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedToken = localStorage.getItem('userId'); // Assuming you store the token in localStorage
                const response = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/eventsuser/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const user = data.find((user) => user.id === Number(storedToken));

                    if (user) {
                        setUserData(user);
                        setProfileData(
                            <div className='relative dash-hdr profile-avatar-imge' onClick={handleProfileClick}>
                                <div className="flex dash-profile items-center" >
                                    <Picture
                                        src={user.profileimage || '/images/emptyprofile.avif'}
                                        alt={id}
                                        width="100"
                                        height="100"
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

        if (id) {
            fetchUserData();
        }
    }, [id, router]);


    return (
        <div className='dashboard-hdr'>
            <Container>
                
                <div className='dashb-inr relative w-auto'>
                    <div>{ProfileDetail}</div>
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
                                                    DefaultButton='profile-btn w-full rounded-md p-2'
                                                    buttonText='Profile'
                                                />
                                            </Link>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='profile-details'>
                                        <Link href={`/userprofile/${id}`}>
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
                                            <Link className={submenuclass} href={`/userprofile/${id}`}>
                                                <Button
                                                    DefaultButton='profile-btn rounded-md p-2'
                                                    buttonText='User Profile'
                                                />
                                            </Link>
                                        </Link>
                                    </div>
                                </>
                            )}
                            
                            <Logout LogoutText='Logout' LogoutClass='submenuclass'/>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default DashboardHeader
