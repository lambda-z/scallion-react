import axios from "axios";
import {ScallionHeadersUtil} from "./scallionHeadersUtil.ts";

console.log('BACKEND_SERVICE_URL: ', process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL || process.env.EXPO_PUBLIC_BACKEND_SERVICE_URL);
export const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL || process.env.EXPO_PUBLIC_BACKEND_SERVICE_URL,
    timeout: 5000,
});

/*
* 请求拦截器
* */
request.interceptors.request.use(
    async (config) => {
        const token = await ScallionHeadersUtil.getBearerAuthorization();
        if (token) {
            config.headers.Authorization = token;
        }
        console.log('scallion-react-request-config: ', config);
        console.log('scallion-react-request-baseurl: ', process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL || process.env.EXPO_PUBLIC_BACKEND_SERVICE_URL);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

/*
* 响应拦截器
* */
request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log("scallion-react-request-response-ERROR", error)
        return error.response || error;
    },
);
