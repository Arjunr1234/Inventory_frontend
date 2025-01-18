import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {  billingProductService, getAllCustomersService, getAllProductService } from "../services/userService";
import { toast } from "sonner";



function Sales() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billingProducts, setBillingProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState("Cash");
  const [totalBill, setTotalBill] = useState(0);

  
  useEffect(() => {
      fetchAllProduct()
      fetchAllCustomers()
  },[])


  const fetchAllCustomers = async() => {
    try {
      const response = await getAllCustomersService();
      if(response.success){
       
       setCustomers(response.customers)
      }else{
        toast.error("Failed to Fetch customers")
      }
     
    } catch (error) {
       console.log("Error in fetchAllCustomers: ", error)
    }
 }
  const fetchAllProduct = async () => {
    try {
      const response = await getAllProductService();
      if (response.success) {
        
        setProducts(response.products);
      } else {
        toast.error(response.message || 'Failed to fetch products.');
      }
    } catch (error) {
      console.error('Error in fetchAllProduct:', error);
      toast.error('Something went wrong while fetching products.');
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery("");
  };

  const handleAddProduct = () => {
    if (!selectedProductId) return toast.warning("Please select a product!");

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) return;

    if (quantity > product.quantity) {
      return toast.warning(
        `Only ${product.quantity} units available for ${product.product}`
      );
    }

    const newProduct = {
      _id: product._id,
      product: product.product,
      quantity,
      price: product.price,
      subtotal: product.price * quantity,
    };

    setBillingProducts([...billingProducts, newProduct]);
    setSelectedProductId("");
    setQuantity(1);
    setPaymentType("Cash");
  };

  const handleRemoveProduct = (index) => {
    const updatedBillingProducts = billingProducts.filter(
      (_, i) => i !== index
    );
    setBillingProducts(updatedBillingProducts);
  };

  const validateDetails = () => {
       if(!selectedCustomer){
          toast.error("Please Select a Customer!!");
          return false
       }
       if(billingProducts.length === 0){
          toast.error("Please add products");
          return false
       }

       return true
  }

  const calculateTotalBill = async() => {
    if(!validateDetails()){
        return 
    }

    const total = billingProducts.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalBill(total);

    const data = {
        customersId:selectedCustomer._id,
        billingProducts,
        paymentType,
        totalAmout:total
    }
    console.log("Selected product: ", billingProducts);
    console.log('This is selected customers: ', selectedCustomer._id);

    const response = await billingProductService(data);
    if(response.success){
      toast.success("Sale recorded successfully!");

      setSelectedCustomer(null);
      setBillingProducts([])
    }

    
  };

  return (
    <div className="p-4">
      <div className="flex items-center p-4 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-2xl font-bold font-mono mx-auto">Billing</h1>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-lg font-semibold">Select Customer:</h2>
        <div className="relative">
          <input
            type="text"
            className="w-[50%] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search for a customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ul className="absolute w-[50%] bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <li
                    key={customer._id}
                    className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    {customer.name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No customers found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Add Products to Billing:</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="" disabled>
              Select Product
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.product}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="100"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button
            onClick={handleAddProduct}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col md:flex-row items-center justify-evenly bg-gray-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2 md:mb-0">Billing Details</h2>
          {selectedCustomer && (
            <div className="text-lg">
              <span>Selected Customer: </span>
              <span className="font-bold font-mono">
                {selectedCustomer.name}
              </span>
            </div>
          )}
        </div>

        {billingProducts.length > 0 ? (
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left border-gray-300">Product Name</th>
                <th className="p-2 border text-center border-gray-300">Price</th>
                <th className="p-2 border text-center border-gray-300">Quantity</th>
                <th className="p-2 border text-center border-gray-300">SubTotal</th>
                <th className="p-1 border text-center border-gray-300">Remove</th>
              </tr>
            </thead>
            <tbody>
              {billingProducts.map((product, index) => (
                <tr key={index}>
                  <td className="p-2 border  border-gray-300">
                    {product.product}
                  </td>
                  <td className="p-2 border text-center border-gray-300">₹{product.price}</td>
                  <td className="p-2 border text-center border-gray-300">
                    {product.quantity}
                  </td>
                  <td className="p-2 border text-center border-gray-300">
                    ₹{product.subtotal}
                  </td>
                  <td className="p-1 border text-center border-gray-300">
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 ">
                <td colSpan="3" className="p-2 text-left font-bold">
                  Total Amount
                </td>
                <td className="p-2 text-center font-bold">
                  ₹
                  {billingProducts.reduce(
                    (sum, item) => sum + item.subtotal,
                    0
                  )}
                </td>
                <td className="p-2"></td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="mt-4 text-gray-500">No products added to billing yet.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end space-x-4">
        <label className="text-lg font-semibold" htmlFor="paymentType">
          Payment Type:
        </label>
        <select
          id="paymentType"
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
        <button
          onClick={calculateTotalBill}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
        >
          Generate Bill
        </button>
      </div>

      {/* {totalBill > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md flex">
          <h3 className="text-xl font-semibold">Total Bill: ₹{totalBill}</h3>
        </div>
      )} */}
    </div>
  );
}

export default Sales
