import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import '../../src/assets/css/style.css';
import '../../app/globals.css';
import '../../src/assets/css/dashboard.css'
import '../../src/assets/css/home.css'
import '../../src/assets/css/style.css'
import dynamic from "next/dynamic";
import DashboardHeader from '../../src/components/Header/DashboardHeader';
const ComingEvents = dynamic(() => import('../../src/components/Events/ComingEvents'))
const HomeEvents = dynamic(() => import('../../src/components/Calendar/HomeEvents'))
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import HomeUser from '../../src/components/userDashboard/HomeUser';
import Link from 'next/link';
import RecipeData from '../../src/components/SCCDetails/RecipeData';
import SCCUserIdDetails from '../../src/components/SCCDetails/SCCUserIdDetails';
import SCContestDetails from '../../src/components/SCCDetails/SCContestDetails';
import Community_phone_book from '../../src/components/Community_Phone_Book/Community_phone_book';
import ComingEventsUsers from '../../src/components/Events/ComingEventsUsers';

const SidebarItem = ({ title, onSelect, isActive }) => {


  const [dropdownmenucnt, setDropDownMenu] = useState('slide_out_dropdown');

  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setDropDownMenu('dropdown_item_slide');
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!token) {
        router.push('/login');
      } else if (role === 'admin') {
        router.push('/admin-profile')
      }
    }
  }, [router]);
  return (
    <div className={`flex flex-col relative ${isActive ? 'active-item' : ''}`}>
      <div
        className="flex items-center justify-between cursor-pointer transition duration-300"
        onClick={() => onSelect(title)}
      >
        <span className="sidebar-itm text-white text-white w-full hover:text-black hover:bg-gray-50 p-4">{title}</span>
      </div>
    </div>
  );
};


function Profile() {
  const router = useRouter();

  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [message, setMessage] = useState('');
  const [notificlass, setNotifyClass] = useState();
  const [sideBarResponsive, setResponsiveClass] = useState('');
  const [selectactive, SetActiveClass] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userstorID = localStorage.getItem('userId');
    setUserId(userstorID);
  }, []);

  const responsiveHeader = () => {
    setResponsiveClass((prevClass) => (prevClass === 'active' ? '' : 'active'));
  };

  const handleMenuSelect = (menuTitle) => {
    setSelectedMenu(menuTitle);
    setResponsiveClass('');
    SetActiveClass('active');
  };
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      if (typeof window !== 'undefined') {
        setNotifyClass('notifications');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setMessage('Logged out successfully');
        setSelectedMenu(null);
        router.push('/login');
      }
    }
  };

  const menuContent = {
    'Dashboard': <HomeUser />,
    'Contest Details': <SCCUserIdDetails />,
    'Upcoming Events Calendar': <HomeEvents />,
    'Upcoming Events': <ComingEventsUsers/>,
    'Community Phone Book': <Community_phone_book />
  };

  return (
    <>
      <p className={notificlass}>{message}</p>
      <button
        className="toggle-sidebar-button"
        onClick={() => responsiveHeader()}
      >

        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="flex h-screen admin-event">
        <div className={`${sideBarResponsive} relative dashboard-left-side bg-gray-800 text-white w-64 p-4`}>
          <h1 className="user_dash_title text-2xl font-semibold mb-4">My Account</h1>
          <SidebarItem title="Dashboard" onSelect={handleMenuSelect} isActive={selectedMenu === "Dashboard"} />
          <SidebarItem title="Contest Details" onSelect={handleMenuSelect} isActive={selectedMenu === "Contest Details"} />
          <SidebarItem title="Upcoming Events Calendar" onSelect={handleMenuSelect} isActive={selectedMenu === "Upcoming Events Calendar"} />
          <SidebarItem title="Upcoming Events" onSelect={handleMenuSelect} isActive={selectedMenu === "Upcoming Events"} />
          <SidebarItem title="Community Phone Book" onSelect={handleMenuSelect} isActive={selectedMenu === "Community Phone Book"} />
          <SidebarItem title="Logout" onSelect={handleLogout} />
          
          <div className='admin-account'>
            <div className='flex items-center account-icon justify-between'>
              <Link href={`/userprofile/${userId}`} className='flex items-center justify-between sidebar-itm side-dr-item text-white'>
                <span>User Profile</span>
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-scroll">
          <DashboardHeader />
          <div className="flex-1 p-4">
            {message && <p className="">{message}</p>}
            {selectedMenu ? (
              <div>
                <h2 className="text-3xl title-menu-sides font-semibold mb-12">{selectedMenu}</h2>
                {menuContent[selectedMenu]}
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
