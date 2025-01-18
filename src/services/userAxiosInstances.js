import axios from "axios";
import { URL } from "../utils/url";

const userAxiosInstance =   axios.create({
      baseURL:URL,
      withCredentials:true,
      headers: {
        'Content-Type': 'application/json',
      },
})

export default userAxiosInstance