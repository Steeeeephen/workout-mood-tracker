import React from 'react'
import Login from "./Login.jsx";

const Auth = () => {

  return (
    <div className="flex flex-col m-auto md:flex-row">

        <Login />

        <a href="/register">Register</a>
    </div>
  )
}

export default Auth