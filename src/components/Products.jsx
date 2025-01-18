import React, { useEffect, useState } from "react";
import { toast } from "sonner"; 
import {
  addProductService,
  deleteProductService,
  getAllProductService,
  updateProductService,
} from "../services/userService";
import Swal from "sweetalert2";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [allProduct, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProduct, setfilteredProducts] = useState([])

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const fetchAllProduct = async () => {
    try {
      const response = await getAllProductService();
      if (response.success) {
        setAllProducts(response.products);
        setfilteredProducts(response.products);
      } else {
        toast.error(response.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error in fetchAllProduct:", error);
      toast.error("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
   handleSearch()
  },[searchTerm]);

  const handleSearch = () => {
     const filteredProduct = allProduct.filter((product) => 
    product.product.toLowerCase().includes(searchTerm.toLowerCase()));
     setfilteredProducts(filteredProduct)
  }
 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditMode(false);
    resetForm();
  };

  const openEditModal = (product) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setCurrentProductId(product._id);
    setProduct(product.product);
    setDescription(product.description);
    setQuantity(product.quantity);
    setPrice(product.price);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!validateForm(product, description, quantity, price)) {
        return;
      }

      const data = {
        product,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      };

      if (isEditMode) {
        
        const response = await updateProductService(currentProductId, data);
        if(response.success){
          const updatedProducts = allProduct.map((p) =>
            p._id === currentProductId ? { ...p, ...data } : p
          );
          setAllProducts(updatedProducts);
          toast.success("Product updated successfully!");
        }
        
      } else {
        const addProduct = await addProductService(data);
        if (addProduct.success) {
          toast.success("Added successfully!");
          setAllProducts((prevProducts) => [...prevProducts, addProduct.product]);
        } else {
          toast.error(addProduct.message || "Failed to add product.");
        }
      }

      resetForm();
      toggleModal();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Something went wrong.");
    }
  };

  const resetForm = () => {
    setProduct("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setCurrentProductId(null);
  };

  const validateForm = (product, description, quantity, price) => {
    if (!product.trim()) {
      toast.error("Product name is required.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return false;
    }
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      toast.error("Quantity must be a valid positive number.");
      return false;
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      toast.error("Price must be a valid positive number.");
      return false;
    }
    return true;
  };

  const confimDelete = (name, productId) => {
     Swal.fire({
           title: 'Are you sure?',
           text: `Do you want to remove ${name} `,
           icon: 'warning',
           showCancelButton: true,
           confirmButtonColor: '#d33',
           cancelButtonColor: '#3085d6',
           confirmButtonText: 'Remove',
         }).then((result) => {
           if (result.isConfirmed) {
             handleDelete(productId)
           }
         });
  }

  const handleDelete = async(productId) => {
      console.log("Thsi is productId: ", productId)
      try {
        const response = await deleteProductService(productId);
        if(response.success){
           const filteredProduct = allProduct.filter((product) => product._id !== productId);
           setAllProducts(filteredProduct)
           toast.success("Successfully removed")
        }
      } catch (error) {
         console.log("Error in handleDelete product: ", error)
      }
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex items-center p-4 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-2xl font-bold font-mono mx-auto">
          Product Details
        </h1>
        <input
          type="text"
          placeholder="Search Products.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-auto px-4 py-2 border rounded-md focus:outline-none"
        />
        <button
          className="ml-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="mt-6">
        <table className="w-full border border-gray-300 bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <tr>
              <th className="p-4 text-left font-semibold text-sm uppercase">
                Product
              </th>
              <th className="p-4 text-left font-semibold text-sm uppercase">
                Description
              </th>
              <th className="p-4 text-center font-semibold text-sm uppercase">
                Quantity
              </th>
              <th className="p-4 text-center font-semibold text-sm uppercase">
                Price
              </th>
              <th className="p-4 text-center font-semibold text-sm uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allProduct && allProduct.length > 0 ? (
              filteredProduct.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition duration-200`}
                >
                  <td className="p-4 text-sm text-gray-800">{product.product}</td>
                  <td className="p-4 text-sm text-gray-800">
                    {product.description}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-800">
                    {product.quantity > 0 ? (
                      <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                        {product.quantity}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-800">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
                      onClick={() => confimDelete(product.product, product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
             
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter Product Name"
              />
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter Description"
              />
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter Quantity"
              />
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter Price"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
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

export default Products;
