import React from 'react'
import Auth from "./auth/Auth.jsx";

const Home = () => {
    return (
        <div className="flex-1 flex justify-around items-center px-8">
            <div className="flex flex-col max-w-md gap-5">
                <h1 className="text-8xl font-extrabold leading-tight">
                    Welcome to this Thing
                </h1>
                <h2 className="text-5xl font-semibold text-teal-800">
                    Subtitle 1
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                </p>
            </div>
            <div>
                <Auth />
            </div>
        </div>
    )
}
export default Home
