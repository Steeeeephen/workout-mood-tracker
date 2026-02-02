import {useAuth} from "../context/AuthContext.jsx";

const Navbar = () => {

    const {isAuthenticated} = useAuth();


  return (

    <>

    
        <nav className='flex justify-between w-3/4 m-auto items-center'>
            <h1 className="text-4xl">NAVBAAAAR (Eventually the logo)</h1>

            <div className="flex gap-4">
                <a href="/">GO TO Home</a>
                {isAuthenticated ? <a href="/dashboard">Dashboard</a> : ''}
            </div>




        </nav>
    
    
    </>
  )
}

export default Navbar