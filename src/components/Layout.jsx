import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaChartLine, FaSignOutAlt, FaFileInvoiceDollar } from "react-icons/fa";
import Swal from 'sweetalert2'
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const {auth, logout} = useAuth()

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const confimLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log me out!',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        toast.success("Successfully logout!!")
      }
    });
  }

  
  return (
    <div className="flex flex-col  sm:flex-row h-screen">
      
      <div className="sm:hidden bg-gray-800 text-white flex items-center justify-between p-4">
        <h1 className="text-3xl text-center font-atma">Let's Shop</h1>
        
        <div
          className=" rounded-md cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <span className="p-2 text-2xl rounded-lg bg-red-500 hover:bg-red-600">×</span> 
          ) : (
            <span className="p-2 rounded-lg bg-gray-700 text-2xl">☰</span> 
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`w-full sm:w-1/5  bg-gray-800 text-white p-6 flex flex-col sm:block transition-transform duration-300 ${
          isSidebarOpen ? "block" : "hidden sm:block"
        }`}
      >
        <h1 className="text-3xl font-atma mb-8 text-center">Let's Shop</h1>
        <ul className="space-y-6">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                ${isActiveRoute("/dashboard") ? "bg-gray-700" : ""}`}
            >
              <FaTachometerAlt className="text-lg" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                ${isActiveRoute("/customers") ? "bg-gray-700" : ""}`}
            >
              <FaUsers className="text-lg" />
              <span>Customers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                ${isActiveRoute("/products") ? "bg-gray-700" : ""}`}
            >
              <FaBox className="text-lg" />
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link
              to="/sales"
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                ${isActiveRoute("/sales") ? "bg-gray-700" : ""}`}
            >
              <FaChartLine className="text-lg" />
              <span>Sales</span>
            </Link>
          </li>
          <li>
            <Link
              to="/report"
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                ${isActiveRoute("/report") ? "bg-gray-700" : ""}`}
            >
              <FaFileInvoiceDollar className="text-lg" />
              <span>Report</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={confimLogout}
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 hover:text-gray-300 transition-colors
                `}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

     
      <div className="w-full sm:w-4/5 bg-gray-100 ">
      
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
