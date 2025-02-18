import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true
});


// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
   
    const originalRequest = error.config;

    if(error.response && error.response.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
        try{
            await axios.post(`${import.meta.env.VITE_BACKENED_API_URL}/auth/refresh`, {}, {withCredentials: true});
            return axiosInstance(originalRequest);
        } catch(refreshError){
            console.log(refreshError);
            window.location.href = "/"
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
  }

);


export const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, data, params }) => {
      try {
        const result = await axiosInstance({
          url: `${baseUrl}${url}`,
          method,
          data,
          params,
          withCredentials: true,
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError.response
          ? {
              status: axiosError.response.status,
              data: axiosError.response.data,
            }
          : { status: 500, data: axiosError.message };
        return { error: err };
      }
    };