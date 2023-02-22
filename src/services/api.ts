
import axios from 'axios';
import { AppError } from '@utils/AppError';

const api = axios.create({
  baseURL: 'http://192.168.2.1:3333'
})

//interceptor, deal with the error and the call
api.interceptors.response.use(response => response, error => {
  if(error.response && error.response.data.message){
    return Promise.reject(new AppError(error.response.data.message))
  } else {
    return Promise.reject(error)
  }
})

export { api };
