import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

const UserNav = () => {

    const {user} = useAuth();
    const userName = user.first_name +" " + user.last_name;

    const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=0d9488&color=fff&size=50`;

    if (!user) return null;

    return (
        <>
            <Link to="/calendar">Calendar</Link>
            <Link className="flex items-center" to="#"><img className="rounded-full" src={avatarUrl} alt=""/></Link>
        </>
    )
}

export default UserNav;