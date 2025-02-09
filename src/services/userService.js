import userAxiosInstance from "./userAxiosInstances"



export const signUpService = async(name, phone, email, password) => {
      try {
        const response = await userAxiosInstance.post('/api/user/signup',{name, phone, email, password} );
        return response.data;
        
      } catch (error) {
         console.log("Error in signUpService", error)
      }
}

export const signInService = async(email, password) => {
     try {
         const response = await userAxiosInstance.post('/api/user/signin',{email, password});
         return response.data
      
     } catch (error) {
        console.log("Error in signInService: ", error);
        throw error
     }
}

export const addProductService = async (data) => {
     try {
       console.log("This is the add product Data: ", data)
        const response = await userAxiosInstance.post('/api/user/add-product',data);
        return response.data
      
     } catch (error) {
        console.log("Error in addProductService: ", error);
        throw error
     }
}

export const addCustomerService = async (data) => {
     try {
      
         const response = await userAxiosInstance.post('/api/user/add-customer', data);
         return response.data;
      
     } catch (error) {
        console.log("Error in addCustomerService: ", error);
        throw error
     }
}

export const getAllCustomersService = async() => {
    try {
         const response = await userAxiosInstance.get('/api/user/get-all-customers');
         
         return response.data
         
      
    } catch (error) {
        console.log("Error in getAllCustomerService: ", error);
        throw error
    }
}

export const getAllProductService = async() => {
     try {
        const response = await userAxiosInstance.get('/api/user/get-all-products');
        
        return response.data
      
     } catch (error) {
        console.log("Error in getAllProductService: ", error);
        throw error
     }
}

export const billingProductService = async(data) => {
    try {
        const response = await userAxiosInstance.post('/api/user/generate-bill', data);
        return response.data
      
    } catch (error) {
        console.log("Error in billing product: ", error)
    }
}

export const salesReportService = async(startDate, endDate) => {
    try {
       const response =  await userAxiosInstance.get(`/api/user/sales-report?startDate=${startDate}&endDate=${endDate}`);
       return response.data
      
    } catch (error) {
       console.log("Error in salesReportService: ", error);
       throw error
    }
}

export const customerLedgerService = async(startDate, endDate, customerId) => {
     try {
        const response = await userAxiosInstance.get(`/api/user/customer-ledger?startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`);
        return response.data
      
     } catch (error) {
        console.log("Error in customerLedger: ", error);
        throw error
     }
}

export const itemsReportService = async(startDate, endDate, productId) => {
   try {
      console.log("this is the product: id: ", productId)
      const response = await userAxiosInstance.get(`/api/user/items-report?startDate=${startDate}&endDate=${endDate}&productId=${productId}`);
      return response.data
    
   } catch (error) {
      console.log("Error in itemsReportService: ", error);
      throw error
   }
}

export const deleteProductService = async(productId) => {
    try {
         const response = await userAxiosInstance.delete(`/api/user/remove-product/${productId}`)
         return response.data

    } catch (error) {
        console.log("Error in deleteProductService: ", error);
        throw error
    }
}

export const deleteCustomerService = async(customerId) => {
   try {
        const response = await userAxiosInstance.delete(`/api/user/remove-customer/${customerId}`)
        return response.data

   } catch (error) {
       console.log("Error in deleteCustomerService: ", error);
       throw error
   }
}

export const updateCustomerService = async(customerId, data) =>{
   try {
      
      const response = await userAxiosInstance.put(`/api/user/update-customer/${customerId}`, data);
      
      return response.data
      
   } catch (error) {
      console.log("Error in updateCustomer: ", error);
      throw error
   }
} 

export const updateProductService = async(productId, data) => {
    try {
        const response = await userAxiosInstance.put(`/api/user/update-product/${productId}`, data);
        return response.data
      
    } catch (error) {
       console.log("Error in updateProductService: ", error);
       throw error
    }
}

