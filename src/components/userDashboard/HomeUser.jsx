import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../../../app/globals.css'
import axios from 'axios';
import 'react-image-lightbox/style.css';
import '../../../src/assets/css/form.css'
import '../../../src/assets/css/profile.css'
import Container from '../Container/Container';
import Heading from '../../atoms/Heading'
import SearchBar from '../SearchBar/SearchBar';
import Paragraph from '../../atoms/Paragraph';
import Stats from '../../atoms/stats/Stats';



const HomeUser = ({ profileinrclass }) => {
  const router = useRouter();
  const { id } = router.query;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching Users both table Data user & scc_details
  useEffect(() => {
    const uservotesID = localStorage.getItem('userId');
    const fetchSccData = async () => {
      try {
        const sccresponse = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/getusersdata/${uservotesID}`);
        if (sccresponse.ok) {
          const datascc = await sccresponse.json();
          const sccuser = datascc.find((user) => user.id === Number(uservotesID));
          console.log('ni ai', uservotesID);
          console.log(datascc);
          if (sccuser) {
            setUsers(sccuser);
          } else {
            setError('User not found');
          }
        } else {
          const usersresponse = await fetch(`https://api.schoolnutritionindustryprofessionals.com/api/userdetails/${uservotesID}`);
          
          if (usersresponse.ok) {
            const datausers = await usersresponse.json();
            setUsers(datausers);
          } else {
            setError('Failed to fetch user data');
          }
        }
              
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (uservotesID) {
      fetchSccData();
    }
  }, []);


  if (loading) {
    return <div className='text-2xl mt-4'>Loading...</div>;
  }

  if (error) {
    return <div className='profile-error'>Error: {error}</div>;
  }

  const statsBox = 'p-4 rounded-md stats-box-class text-white';

  return (
    <div>
      <div className="main-users-dashbrd">
        <Container>

          <div className=''>
            <div key={id} className={`user_dashboard`}>
              <div className="usercontent mb-4 flex items-center justify-between">
                <div className='userTitle'>
                  <h1>{`Hello, ${users.username}`} <span>( Dashboard is updating constantly to have more functionalities. )</span></h1>
                </div>
              </div>
              <div className='mt-4 mb-8 searchbar'>
                <SearchBar />
              </div>
              <div className="main-stats-boxes grid grid-cols-3 gap-4">
                <Stats
                  mainstatsclass={statsBox}
                  statstitleclass="stats-box-title"
                  statstitle="User Vote"
                  statsitclass='flex items-center justify-between'
                  statscontentclass="stats-content"
                  statstextclass="stats-text"
                  statsiconclass="stats-icon"
                  statscount={`Vote Count :  ${users.vote}`}
                  statsiconhref="https://api.schoolnutritionindustryprofessionals.com/public/images/usericon.png"
                />
              </div>
            </div>
          </div>


        </Container>
      </div>

    </div>

  );
};

export default HomeUser;
