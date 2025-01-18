import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = ({redirectTo = '/'}) => {
   const {auth} = useAuth();

   return auth.isLoggedIn ? <Outlet/> : <Navigate to={redirectTo} replace/>
}

export default ProtectedRoute