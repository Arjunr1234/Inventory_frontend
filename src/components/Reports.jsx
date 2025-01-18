import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customerLedgerService, getAllCustomersService, getAllProductService, itemsReportService, salesReportService } from "../services/userService";
import { toast } from "sonner";

function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchAllCustomers();
    fetchAllProduct();
  }, []);

  useEffect(() => {
    getReport();
  }, [startDate, endDate, reportType, selectedCustomer, selectedProduct]);

  const fetchAllCustomers = async () => {
    try {
      const response = await getAllCustomersService();
      if (response.success) {
        setCustomers(response.customers);
      } else {
        toast.error("Failed to Fetch customers");
      }
    } catch (error) {
      console.log("Error in fetchAllCustomers: ", error);
    }
  };

  const fetchAllProduct = async () => {
    try {
      const response = await getAllProductService();
      if (response.success) {
        setProducts(response.products);
      } else {
        toast.error(response.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error in fetchAllProduct:", error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  const getReport = async () => {
    try {
      if (reportType === "sales") {
        const fetchSalesReport = await salesReportService(startDate, endDate);
        if (fetchSalesReport.success) {
          setReportData(fetchSalesReport.salesData);
          console.log('This is the sales: ', fetchSalesReport.salesData);
          
        }
      } else if (reportType === "item") {
        if (!selectedProduct) {
          toast.info("Please select Product");
          return;
        }
        const fetchItemsReport = await itemsReportService(startDate, endDate, selectedProduct);
        if (fetchItemsReport.success) {
          setReportData(fetchItemsReport.itemsReport);
        }
      } else if (reportType === "customer") {
        if (!selectedCustomer) {
          toast.info("Please select Customer");
          return;
        }
        const fetchCustomerReport = await customerLedgerService(startDate, endDate, selectedCustomer);
        if (fetchCustomerReport.success) {
          setReportData(fetchCustomerReport.customerReport);
        }
      }
    } catch (error) {
      console.log("Error in getting sales Report: ", error);
    }
  };

  
  const totalAmount = reportData.reduce((sum, sale) => sum + (sale.price * sale.quantity || 0), 0);

  return (
    <div className="p-4">
      <div className="p-4 bg-gray-50 rounded-md shadow-lg space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md shadow-md">
          <h1 className="text-lg font-bold font-mono">Report</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" htmlFor="reportType">
              Type:
            </label>
            <select
              id="reportType"
              className="p-1 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Sales Report</option>
              <option value="item">Items Report</option>
              <option value="customer">Customer Ledger</option>
            </select>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Start Date Picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="startDate">
              Start Date
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-1 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* End Date Picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="endDate">
              End Date
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-1 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Customer Selection */}
          {reportType === "customer" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1" htmlFor="customerSelection">
                Customer
              </label>
              <select
                id="customerSelection"
                className="p-1 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Product Selection */}
          {reportType === "item" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1" htmlFor="productSelection">
                Product
              </label>
              <select
                id="productSelection"
                className="p-1 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
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
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <table className="min-w-full border-collapse overflow-hidden border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <tr>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Sale Date</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Product Name</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Customer</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Price</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Quantity</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">SubTotal</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((sale, index) => (
            <tr
              key={sale._id}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-blue-100 transition duration-200`}
            >
              <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                {new Date(sale.saleDate).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                {sale.productName}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                {sale.customer}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-green-600 font-bold">
                ₹{sale.price}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                {sale.quantity}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-green-600 font-bold">
                ₹{sale.price * sale.quantity}
              </td>
              <td className="border border-gray-300 px-6 py-4 text-sm text-gray-800">
                {sale.paymentType}
              </td>
            </tr>
          ))}

         
          <tr className="bg-gray-200 font-bold">
            <td colSpan="5" className="border border-gray-300 px-6 py-4 text-left">
              Total Amount
            </td>
            <td colSpan="3" className="border border-gray-300 px-6 py-4 text-green-600">
              ₹{totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
``
