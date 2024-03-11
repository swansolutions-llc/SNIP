// components/Layout.js
import React, { useState, useEffect } from 'react';

import Events from '../Calendar/Events'
import { useRouter } from 'next/router';
import '../../assets/css/dashboard.css'
import ComingEvents from '../Events/ComingEvents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faTachometerAlt, faUser, faBars, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import HomeAdmin from './HomeAdmin';
import Picture from '../../atoms/Image';
import DashboardHeader from '../Header/DashboardHeader';
import AdminProfile from '../Profile/AdminProfile';
import Users from '../GetUsers/Users';
import Link from 'next/link';
import AllEvents from '../Events/AllEvents';
import AddDistrict from '../Districts/AddDistrict';
import FetchDistrict from '../Districts/FetchDistrict';
import SCCUsers from '../SCCDetails/SCCUsers';
import RecipeData from '../SCCDetails/RecipeData';
import Community_get_edit from '../Community_Phone_Book/Community_get_edit';
import AddNewCommunityPhone from '../Community_Phone_Book/Add_New_Community_phone';

const SidebarItem = ({ title, Icon, onSelect, dropdownItems, isActive, dropdownOpen, setDropdownOpen }) => {
  const [notificlass, setNotifyClass] = useState();
  const [message, setMessage] = useState();
  const [dropdownmenucnt, setDropDownMenu] = useState('slide_out_dropdown');

  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setDropDownMenu(isDropdownOpen ? 'slide_out_dropdown' : 'dropdown_item_slide');

    if (isDropdownOpen) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(title);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setNotifyClass('notifications')
        setMessage('Logout Successfully')
        router.push('/');
      }
    }
  };
  const handleItemClick = () => {
    if (title === 'Logout') {
      handleLogout();
    } else {
      onSelect(title);
    }
  };




  return (
    <>
      <p className={notificlass}>{message}</p>

      <div className={`flex flex-col relative fixed ${isActive ? 'active-item' : ''}`}>

        {!dropdownItems && (
          <div
            className="sidebar-itm flex items-center justify-between cursor-pointer transition duration-300"
            onClick={handleItemClick}
          >
            <span className={`text-white w-full ${isActive ? 'active' : ''}`}>
              {Icon && <FontAwesomeIcon icon={Icon} />} {title}
            </span>
          </div>
        )}
        {dropdownItems && (
          <div onClick={handleDropdownToggle} className="sidebar-itm side-dr-item flex items-center justify-between cursor-pointer dropdown-icon transition duration-300">
            <span className={`text-white w-full ${isActive ? 'active' : ''}`}>
              {Icon && <FontAwesomeIcon icon={Icon} />} {title}
            </span>
            <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} />
          </div>
        )}
        {isDropdownOpen && dropdownItems && (
          <div className={`sidebar-dropdown-itm dropdown-menu text-white ${isActive ? 'active-item' : ''} transition duration-300 ${dropdownmenucnt}`}>
            {dropdownItems.map((item) => (
              <div
                key={item.title}
                className={`side-dr-item flex items-center justify-between cursor-pointer ${item.isActive ? 'active' : ''
                  }`}
              >
                <span
                  className={`sidebar-itm text-white w-full ${item.isActive ? 'active' : ''}`}
                  onClick={() => onSelect(item.title)}
                >
                  {item.title}
                </span>
                <FontAwesomeIcon icon={item.Icon} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>

  );
};

const AdminDashboard = ({ children }) => {

  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [sideBarResponsive, setResponsiveClass] = useState('');
  const handleMenuSelect = (menuTitle) => {
    setSelectedMenu(menuTitle);
    setResponsiveClass('');
  };
  const [dropdownOpen, setDropdownOpen] = useState(null);


  const responsiveHeader = () => {
    setResponsiveClass((prevClass) => (prevClass === 'active' ? '' : 'active'));
  };
  


  const menuContent = {
    'Dashboard': <HomeAdmin />,
    'Admin Profile': <AdminProfile />,
    'Add District': <AddDistrict />,
    'District': <FetchDistrict />,
    'Events Calendar': <Events />,
    'Upcoming Events': <ComingEvents />,
    'Events': <AllEvents />,
    'Users': (
      <div className=''>
        <Users tablerow='hover:text-white hover:bg-gray-900' />
      </div>
    ),
    'SCC Users': <SCCUsers/>,
    'SCC Recipe': <RecipeData/>,
    'Community Phone Book': <Community_get_edit/>,
    'Add New Community Phone Book': <AddNewCommunityPhone/>
  };


  const sidebarItems = [
    { title: 'Dashboard', Icon: { faTachometerAlt }, isActive: selectedMenu === 'Dashboard' },
    { title: 'Users', isActive: selectedMenu === 'Users' },
    {
      title: 'SCC Users Details', dropdownItems: [
        { title: 'SCC Users', isActive: selectedMenu === 'SCC Users' },
        { title: 'SCC Recipe', isActive: selectedMenu === 'SCC Recipe' }
      ],
    },
    {
      title: 'District Management', dropdownItems: [
        { title: 'District', isActive: selectedMenu === 'District' },
        { title: 'Add District', isActive: selectedMenu === 'Add District' }
      ],
    },
    {
      title: 'Events Management', dropdownItems: [
        { title: 'Events Calendar', isActive: selectedMenu === 'Events Calendar' },
        { title: 'Events', isActive: selectedMenu === 'Events' },
        { title: 'Upcoming Events', isActive: selectedMenu === 'Upcoming Events' }
      ],
    },
    {
      title: 'Community Phone Book', dropdownItems: [
        { title: 'Add New Community Phone Book', isActive: selectedMenu === 'Add New Community Phone Book' },
        { title: 'Community Phone Book', isActive: selectedMenu === 'Community Phone Book' },
      ],
    },
    { title: 'Logout', isActive: selectedMenu === 'Logout' },
  ];

  const handleDropdownToggle = (title) => {
    setDropdownOpen((prevOpen) => (prevOpen === title ? null : title));
  };
  


  return (
    <div className="flex h-screen admin-event">
      <button
        className="toggle-sidebar-button"
        onClick={() => responsiveHeader()}
      >
        
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={`${sideBarResponsive} pc-1 dashboard-left-side text-white w-64 relative`}>
        <Picture
          width="500"
          height="200"
          src='https://api.schoolnutritionindustryprofessionals.com/public/images/SNIP_Logo-3.png'
          alt='SNIP'
          LogoClass='dashboard-logo'
        />

        {/* <div className='admin-menu-icon flex items-center justify-between py-4'>
          <h3 className="text-1xl m-0 font-semibold mb-4">Main Menu</h3>
          <FontAwesomeIcon icon={faChartBar} />
        </div> */}

        {/* <div className='admin-menu-icon flex items-center justify-between py-4'>
          <h3 className="text-1xl font-semibold mb-4">Dashboard</h3>
          <FontAwesomeIcon icon={faTachometerAlt} />
        </div> */}


        <div className='dash-sidebar-item'>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              onSelect={handleMenuSelect}
              dropdownItems={item.dropdownItems}
              isActive={item.isActive}
              setDropdownOpen={handleDropdownToggle}
              dropdownOpen={dropdownOpen}
            />
          ))}
        </div>

        <div className='admin-account'>
          <div className='flex items-center account-icon justify-between'>
            <Link href='admin-profile' className='flex items-center justify-between sidebar-itm side-dr-item text-white'>
              <span>Admin Profile</span>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
        </div>

      </div>
      <div className="flex-1 p-4 overflow-y-scroll">
        <DashboardHeader />
        <div className="flex-1 p-4">
          {selectedMenu ? (
            <div>
              <h2 className="text-3xl font-semibold mb-12">{selectedMenu}</h2>
              {menuContent[selectedMenu]}
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
