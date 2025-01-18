import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
       
        <h1 className="text-9xl font-bold text-gray-800 animate-pulse">404</h1>
        
        <p className="text-2xl text-gray-600 mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-lg text-gray-500 mt-2">
          It might have been moved or deleted.
        </p>
        
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Go Back to Home
        </Link>
      </div>
     
      <div className="mt-10">
        <img
          src="https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif"
          alt="Confused Robot"
          className="w-64 h-64 object-contain mx-auto"
        />
      </div>
    </div>
  );
}

export default NotFound;
