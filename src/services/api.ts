import axios, { AxiosError, AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: 'http://192.168.2.1:3333'
}) as APIInstanceProps;

let failedQueued: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = singOut => {
  //token
  const interceptTokenManager = api.interceptors.response.use((response) => response, async (requestError) => {
    if(requestError.response?.status === 401) {
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const { refresh_token } = await storageAuthTokenGet();

        if(!refresh_token) {
          singOut();
          return Promise.reject(requestError)
        }

        //todas as configs da request
        const originalRequestConfig = requestError.config;

        if(isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueued.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                resolve(api(originalRequestConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/sessions/refresh-token', { refresh_token });
            await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });

            if(originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
            }

            originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            failedQueued.forEach(request => {
              request.onSuccess(data.token);
            });

            console.log("TOKEN ATUALIZADO");

            resolve(api(originalRequestConfig));
          } catch (error: any) {
            console.log(error)
            failedQueued.forEach(request => {
              request.onFailure(error);
            })

            singOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueued = []
          }
        })

      }
      // se o problema nao for token, entao desloga
      singOut();

    }


    // codigo abaixo e somente tratativa das das mensagens da api, nao envolver token
    if(requestError.response && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message))
    } else {
      return Promise.reject(requestError)
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  }
}



export { api };


////////////////////////////////


// import axios, { AxiosError } from 'axios';
// import { AppError } from '@utils/AppError';

// const api = axios.create({
//   baseURL: 'http://192.168.2.1:3333'
// })

// type SignOut = () => void;

// type PromiseType = {
//   onSuccess: (token: string) => void;
//   onFailure: (error: AxiosError) => void;
// } as A

// //interceptor, deal with the error and the call
// api.interceptors.response.use(response => response, error => {
//   if(error.response && error.response.data.message){
//     return Promise.reject(new AppError(error.response.data.message))
//   } else {
//     return Promise.reject(error)
//   }
// })

// export { api };
