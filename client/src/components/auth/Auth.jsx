import React from 'react'
import './auth.css'
import Login from "./Login.jsx";
const Auth = () => {

  return (
    <div className="flex flex-col w-3/4 m-auto justify-evenly md:flex-row">

        <Login />

        <form action="" className="login-forms">
            <h3 className="text-2xl mb-10 text-center">Register </h3>

            <label htmlFor="firstName" className="sr-only">First Name</label>
            <input type="text" name="firstName" id="firstName" placeholder="First Name" className="text-input"/>

            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <input type="text" name="lastName" id="lastName" placeholder="Last Name" className="text-input"/>

            <label htmlFor="email" className="sr-only">Email</label>
            <input type="email" name="email" id="registerEmail" placeholder='Email' className="text-input"/>

            <label htmlFor="password" className="sr-only">Password</label>
            <input type="password" name="password" id="registerPassword" placeholder="Password" className="text-input" />

            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" className="text-input" />

            <button type="submit" className="btn-submit bg-green-400 rounded p-1">Register</button>

        </form>
    </div>
  )
}

export default Auth