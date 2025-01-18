import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Dashboard Container */}
      <div className="bg-white shadow-lg rounded-lg w-11/12 md:w-3/4 lg:w-2/3 p-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 animate-fadeIn">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your inventory efficiently and effortlessly.
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-blue-700 font-bold text-xl">Customers</h2>
            <p className="text-blue-500 mt-1">View and manage all Customers</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-green-700 font-bold text-xl">Products</h2>
            <p className="text-green-500 mt-1">View all your avaliable products</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-yellow-700 font-bold text-xl">Reports</h2>
            <p className="text-yellow-500 mt-1">View business reports</p>
          </div>
        </div>

        
        
      </div>
    </div>
  );
}

export default Dashboard;
