import axios from "axios"
import setupInterceptors from "../../common/utils/authInterceptor"

const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTION_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

setupInterceptors(api)

export default api
