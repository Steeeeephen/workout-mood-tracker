import React, {useState} from 'react'
import api from '../config/api.js'
import { useNavigate } from 'react-router-dom'; // Add this
import { useAuth } from '../context/AuthContext.jsx'; // Add this

const Login = () => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true)
        try {
            await login(email, password);
            console.log('Login worked!');
            navigate('/dashboard');


        } catch (err) {
            setError('Login Failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} action="" className="login-forms bg-zinc-50 px-5 py-10 rounded-2xl flex flex-col gap-4 shadow-xl shadow-zinc-400" >
            <h3 className="text-2xl mb-10 text-center">Login</h3>

            <label htmlFor="email" className="sr-only">Email</label>
            <input
                type="email"
                name="email"
                id="login-email"
                placeholder='Email'
                className="text-input border-b-2  p-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" className="sr-only">Password</label>
            <input
                type="password"
                name="password"
                id="login-password"
                placeholder="Password"
                className="text-input mb-10 border-b-2  p-1"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" className="btn-submit bg-green-400 rounded p-1">Login</button>
            <span className="m-auto pt-10">Forgot password? Click <a className="text-blue-600" href="#">here</a>.</span>
        </form>
    )
}
export default Login


