import React, {useEffect} from 'react'
import '../app/globals.css';
import '../src/assets/css/style.css';
import '../src/assets/css/dashboard.css';
import { useRouter } from 'next/router';
import dynamic from "next/dynamic"; 
const AdminDashboard = dynamic(()=> import('../src/components/Admin Dashboard/AdminDasboard'))


function Admin() {
  const router = useRouter();
  
  useEffect(() => {
      const adminrole = localStorage.getItem('role');
      console.log(adminrole)
      if(adminrole !== 'admin' ){
        router.push('/')
      }else if (!adminrole){
        router.push('/login')
      }
      
  }, [router]);
  
  return (
    <div>
      <AdminDashboard />
    </div>
  )
}

export default Admin
