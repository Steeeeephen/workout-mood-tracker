import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router-dom";

const Navbar = () => {
    const {isAuthenticated} = useAuth();
    return (
        <nav className='flex justify-between w-3/4 mx-auto items-center py-6'>
            <h1 className="text-4xl"><span className="font-extrabold">App</span> Name</h1>

            <div className="flex gap-4">
                <a href="/">GO TO Home</a>
                {isAuthenticated ? <Link to="/dashboard">Dashboard</Link> : ''}
            </div>
        </nav>
    )
}

export default Navbar