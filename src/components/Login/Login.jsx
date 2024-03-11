import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../../../app/globals.css'
import Link from 'next/link';
import Logo from '../../atoms/logo';


const Login = () => {
  const router = useRouter();

// Add Rember Option
useEffect(() => {
  const storedCredentials = localStorage.getItem('rememberedCredentials');

  if (storedCredentials) {
    const credentials = JSON.parse(storedCredentials);
    setIdentifier(credentials.identifier);
    setPassword(credentials.password);
    setRememberMe(credentials.rememberMe);
  }
}, []);

  const [rememberMe, setRememberMe] = useState(false);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (role) {
        router.push('/admin');
      } else if (token) {
        router.push(`/profile/${userId}`);
      }
    }
  }, [router]);

  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const history = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const button = 'w-auto bg-violet-600 text-white px-4 p-2 rounded hover:bg-violet-900';
  const border = 'border-2 rounded-md';
  const [notificlass ,setNotifyClass] = useState();
  const [erronotificlass , setErrorNotifyClass] = useState();
  const [messageerror, setMessageError] = useState('');

  

  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);
    setNotifyClass(null)
    setMessage(null)
    setErrorNotifyClass(null)
    setMessageError(null)

    try {
      const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/logins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      if (!response.ok) {
        setNotifyClass('notifications')
        setMessage('Network response was not ok');
        throw new Error('Network response was not ok');
      }else if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        if (rememberMe) {
          const credentialsToRemember = JSON.stringify({ identifier, password });
          localStorage.setItem('rememberedCredentials', credentialsToRemember);
        } 
          setNotifyClass('notifications')
          setMessage('logged in successfully');
          setLoading(false); 

          if (data.role === 'admin') {
            history.push(`/admin`);
            console.log("in admin")
          }
          else
          history.push(`/profile/${data.userId}`);
      } 
      else {
        setNotifyClass('notifications')
        setErrorNotifyClass('notifications errornotifiy')
        setMessageError('Failed to login');
        setLoading(false); 
        console.error('Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
      setNotifyClass('notifications')
      setErrorNotifyClass('notifications errornotifiy')
      setLoading(false); 
      setMessageError('This user not register. Please Sign Up.');
      
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="rounded-md flex justify-center">
      <div className="shadow-md">
        <h1 className="title-form text-2xl mb-8 text-center font-bold"><span>Welcome To Dashboard</span> Let&apos;s Login</h1>
        <div className='login-logo-snip flex mb-8 justify-center'>
          <Link href='/'> 
            <Logo src="/images/SNIP_Logo-1.png"
                />
          </Link>
        </div>
        <form onSubmit={handleLogin}>
          <label className='mb-2 text-base font-semibold leading-6 text-gray-900'>Username or Email</label>
          <input required
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={`w-full p-2 input-margin ${border} mb-20px`}
          />
          <label className='mb-2 text-base font-semibold leading-6 text-gray-900'>Password</label>
          <input required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full input-margin p-2 ${border} `}
          />
          
         <button className={button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <label className="login-checkbos mb-2 text-base font-semibold leading-6 text-gray-900">
            Remember Me
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className=""
            />
          </label>
        </form>
        <div className='signup-event'>
        <p>Don&apos;t have an account? <span><Link href='/signup'>Sign up now. </Link></span></p>
        </div>
        <p className={`notifiy ${notificlass}`}>{message}</p>
        <p className={erronotificlass}>{messageerror}</p>
      </div>
    </div>
  );
};

export default Login;
