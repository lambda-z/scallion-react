import axios from "axios";
import {ScallionHeadersUtil} from "./scallionHeadersUtil.ts";


export const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL,
    timeout: 5000,
});

/*
* 请求拦截器
* */
request.interceptors.request.use(
    (config) => {
        config.headers.Authorization = ScallionHeadersUtil.getBearerAuthorization();
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
        // console.log("ERROR", error)
        if (error.status == 401) {
            // const isMobile = window.innerWidth < 768; // 判断当前设备是否为移动设备，这里假设小于768px为移动设备
            const isMobile = localStorage.getItem("isMobile") === "true";
            // 跳转到登录页面
            if (isMobile) {
                window.location.replace("/mlogin");
            } else {
                window.location.replace("/login");
            }
            localStorage.removeItem("token");
        }
        return error.response || error;
    },
);
