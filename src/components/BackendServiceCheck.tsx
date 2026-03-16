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

    checkHealth(){

        let ret = {}

        this.api.getHealth().then(
            (resp) => {
                ret = resp?.data;
                console.log("checkHealth.then: ", ret);
            }
        ).catch(
            (error) => {
                console.error('BackendService Connect Error: ', error)
                ret = {service_name: null, status: "error", message: "No Service Connect."}
                console.log("checkHealth.catch: ", ret);
            }
        ).finally(
            () => {
                console.log("checkHealth.finally: ", ret);
            }
        )

        console.log("checkHealth.return: ", ret);
        return ret;
    }
}


export function BackendServiceCheck() {

    const service = new BackendServiceImpl();
    const [data, setData] = useState({service_name: '', status: '', message: ''});

    const checkHealth = async () => {
        const resp = service.checkHealth();
        setData({message: "", service_name: "", status: "", ...resp})
    }

    useEffect(() => {
        checkHealth().then();
    }, []);

    return (
        <div>
            BackendServiceCheck: {data?.service_name}
        </div>
    )

}
