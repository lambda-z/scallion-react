'use client';

import {DRFApi} from "../drf-api/DRFApi.ts";
import {DRFServiceImpl} from "../drf-api/service.ts";
import {useEffect, useState} from "react";
import {request} from "../utils/request";

class BackendServiceMetaApi extends DRFApi {

    URL = '/health';

    async getHealth() {
        return await request.get(this.URL, {});
    }
}

class BackendServiceImpl extends DRFServiceImpl {
    api = new BackendServiceMetaApi();

    async checkHealth(){
        let ret = {}
        try {
            const resp = await this.api.getHealth();
            ret = resp?.data;
            console.log("checkHealth.then: ", ret);
        } catch {
            console.error('BackendService Connect Error: ', '')
            ret = {service_name: null, status: "error", message: "No Service Connect."}
            console.log("checkHealth.catch: ", ret);
        }
        console.log("checkHealth.return: ", ret);
        return ret;
    }
}


export function BackendServiceCheck() {

    const service = new BackendServiceImpl();
    const [data, setData] = useState({service_name: '', status: '', message: ''});

    const checkHealth = async () => {
        const resp = await service.checkHealth();
        setData({message: "", service_name: "", status: "", ...resp});
    }

    useEffect(() => {
        checkHealth().then();
    }, []);

    return (
        <>
            BackendServiceCheck: {data?.message}
        </>
    )
}
