import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addCustomerService,
  deleteCustomerService,
  getAllCustomersService,
  updateCustomerService,
} from "../services/userService";
import Swal from "sweetalert2";

function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [customers, setCustomers] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredCustomers, setFilteredCustomers] = useState([]); 

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  useEffect(() => {
    handleSearch(); 
  }, [searchTerm, customers]);

  const fetchAllCustomers = async () => {
    try {
      const response = await getAllCustomersService();
      if (response.success) {
        setCustomers(response.customers);
        setFilteredCustomers(response.customers); // Set initial filtered list
      } else {
        toast.error("Failed to fetch customers");
      }
    } catch (error) {
      console.log("Error in fetchAllCustomers: ", error);
    }
  };

  const handleSearch = () => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const toggleModal = (customer = null) => {
    if (customer) {
      setEditingCustomerId(customer._id);
      setName(customer.name);
      setAddress(customer.address);
      setPhone(customer.phone);
    } else {
      setEditingCustomerId(null);
      setName("");
      setAddress("");
      setPhone("");
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleCustomerDetails = async (event) => {
    event.preventDefault();

    if (!validateForm(name, address, phone)) {
      return;
    }

    const data = { name, address, phone };

    if (editingCustomerId) {
      const updateCustomer = await updateCustomerService(editingCustomerId, data);
      if (updateCustomer.success) {
        const updatedCustomer = { ...data, _id: editingCustomerId };
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === editingCustomerId ? updatedCustomer : customer
          )
        );
        toast.success("Customer updated successfully");
      }
    } else {
      const addCustomer = await addCustomerService(data);
      if (addCustomer.success) {
        toast.success("Successfully added");
        setCustomers((prevCustomers) => [...prevCustomers, addCustomer.customer]);
      }
    }

    toggleModal();
  };

  const validateForm = (name, address, phone) => {
    if (!name.trim()) {
      toast.error("Name is required!!");
      return false;
    }
    if (!address.trim()) {
      toast.error("Address is required!!");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required!!");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number!!");
      return false;
    }
    return true;
  };

  const handleDelete = async (customerId) => {
    try {
      const response = await deleteCustomerService(customerId);
      if (response.success) {
        const filteredCustomers = customers.filter(
          (customer) => customer._id !== customerId
        );
        setCustomers(filteredCustomers);
        toast.success("Successfully Removed!!");
      }
    } catch (error) {
      console.log("Error occurred in handleDelete: ", error);
    }
  };

  const confirmDelete = (name, customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${name} `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(customerId);
      }
    });
  };

  return (
    <div className="p-1">
      <div className="flex items-center bg-gray-200 p-4 rounded-md shadow-md relative">
        <h1 className="text-2xl text-gray-700 absolute left-1/2 transform -translate-x-1/2">
          Customer Details
        </h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-auto px-4 py-2 border rounded-md focus:outline-none"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          onClick={() => toggleModal()}
        >
          Add Customer
        </button>
      </div>

      <table className="table-auto w-full mt-4 border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-6 py-3 font-semibold">Name</th>
            <th className="border border-gray-300 px-6 py-3 font-semibold">Phone</th>
            <th className="border border-gray-300 px-6 py-3 font-semibold">Address</th>
            <th className="border border-gray-300 px-6 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer._id}
              className="text-gray-700 text-center hover:bg-gray-100 transition-colors duration-200"
            >
              <td className="border border-gray-300 px-6 py-3">{customer.name}</td>
              <td className="border border-gray-300 px-6 py-3">{customer.phone}</td>
              <td className="border border-gray-300 px-6 py-3">{customer.address}</td>
              <td className="border border-gray-300 px-6 py-3 flex justify-center gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 shadow"
                  onClick={() => toggleModal(customer)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow"
                  onClick={() => confirmDelete(customer.name, customer._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => toggleModal()}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg text-center font-bold mb-4">
              {editingCustomerId ? "Edit Customer" : "Add Customer"}
            </h2>
            <form onSubmit={handleCustomerDetails}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                value={name}
                placeholder="Enter customer name"
                className="w-full p-2 border rounded-md mb-4"
                onChange={(e) => setName(e.target.value)}
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter customer address"
                className="w-full p-2 border rounded-md mb-4"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter customer phone"
                className="w-full p-2 border rounded-md mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toggleModal()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md mr-2 hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
