import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  customerLedgerService,
  getAllCustomersService,
  getAllProductService,
  itemsReportService,
  salesReportService,
} from "../services/userService";
import { toast } from "sonner";
import jsPdf from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from "xlsx";

function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reportData, setReportData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  

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
          console.log("This is the sales: ", fetchSalesReport.salesData);
        }
      } else if (reportType === "item") {
        if (!selectedProduct) {
          toast.info("Please select Product");
          return;
        }
        const fetchItemsReport = await itemsReportService(
          startDate,
          endDate,
          selectedProduct
        );
        if (fetchItemsReport.success) {
          setReportData(fetchItemsReport.itemsReport);
        }
      } else if (reportType === "customer") {
        if (!selectedCustomer) {
          toast.info("Please select Customer");
          return;
        }
        const fetchCustomerReport = await customerLedgerService(
          startDate,
          endDate,
          selectedCustomer
        );
        if (fetchCustomerReport.success) {
          setReportData(fetchCustomerReport.customerReport);
        }
      }
    } catch (error) {
      console.log("Error in getting sales Report: ", error);
    }
  };

  const totalAmount = reportData.reduce(
    (sum, sale) => sum + (sale.price * sale.quantity || 0),
    0
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = (type) => {
    if(type === 'PDF'){
       generatePDF()
       toast.success("Successfully downloaded");
    }else if (type === "Excel") {
      generateExcel();
      toast.success("Successfully downloaded");
    }
    setDropdownOpen(false);
    console.log(`Downloading report as ${type}`); 
  };

  const generatePDF = () => {
    const doc = new jsPdf();
    let pageNumber = 1;
    const rowsPerPage = 50;
    const chunkedReports = [];
  
    
    for (let i = 0; i < reportData.length; i += rowsPerPage) {
      chunkedReports.push(reportData.slice(i, i + rowsPerPage));
    }
  
    
    const calculateTotals = (data) => {
      let totalPrice = 0;
      let totalQuantity = 0;
      let totalSubtotal = 0;
  
      data.forEach((report) => {
        totalPrice += report.price;
        totalQuantity += report.quantity;
        totalSubtotal += report.price * report.quantity;
      });
  
      return [ "Total:",null, null,  null, null, totalSubtotal];
    };
  
    chunkedReports.forEach((chunk, index) => {
      if (index > 0) doc.addPage();
  
      
      doc.text(`Sales Report - Page ${pageNumber}`, 14, 10);
  
      
      const tableData = chunk.map((report) => [
        new Date(report.saleDate).toLocaleDateString(),
        report.productName,
        report.customer,
        report.price.toFixed(2),
        report.quantity,
        (report.price * report.quantity).toFixed(2),
      ]);
  
      
      const totalsRow = calculateTotals(chunk);
      tableData.push(totalsRow);
  
    
      doc.autoTable({
        startY: 20,
        head: [["Date", "Product", "Customer", "Price", "Quantity", "Subtotal"]],
        body: tableData,
        didDrawCell: (data) => {
          
          if (data.row.index === tableData.length - 1) {
            doc.setFont("helvetica", "bold");
          }
        },
      });
  
      pageNumber++;
    });
  
    
    doc.save("sales_report.pdf");
  };

  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Date", "Product", "Customer", "Price", "Quantity", "Subtotal"],
      ...reportData.map((report) => [
        new Date(report.saleDate).toLocaleDateString(),
        report.productName,
        report.customer,
        report.price.toFixed(2),
        report.quantity,
        (report.price * report.quantity).toFixed(2),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, "sales_report.xlsx");
  };
  

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
        <div className="flex flex-col md:flex-row md:items-end gap-4 relative">
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
              <label
                className="text-sm font-medium mb-1"
                htmlFor="customerSelection"
              >
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
              <label
                className="text-sm font-medium mb-1"
                htmlFor="productSelection"
              >
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
          <div className="absolute right-0 "
          ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Download
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                <button
                   onClick={() => handleDownload("PDF")}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                   PDF
              </button>
                <button
                   onClick={() => handleDownload("Excel")}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                   Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <table className="min-w-full border-collapse overflow-hidden border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <tr>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Sale Date
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Product Name
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Customer
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Price
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Quantity
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              SubTotal
            </th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold tracking-wide">
              Payment Type
            </th>
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
            <td
              colSpan="5"
              className="border border-gray-300 px-6 py-4 text-left"
            >
              Total Amount
            </td>
            <td
              colSpan="3"
              className="border border-gray-300 px-6 py-4 text-green-600"
            >
              ₹{totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
``;
