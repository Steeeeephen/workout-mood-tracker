import {useAuth} from "../context/AuthContext.jsx";

const Navbar = () => {

    const {isAuthenticated} = useAuth();


  return (

    <>

    
        <nav className='flex'>
            <h1>NAVBAAAAR</h1>
            <a href="/">GO TO Home</a>


            {isAuthenticated ? <a href="/dashboard">Dashboard</a> : ''}


        </nav>
    
    
    </>
  )
}

export default Navbar