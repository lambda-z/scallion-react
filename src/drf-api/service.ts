import {DRFApi} from "./DRFApi.ts";


export interface DRFService {

    api: DRFApi;

    // list
    list(params?: any): Promise<any>;
}


export class DRFServiceImpl implements DRFService {

    api: DRFApi = new DRFApi();

    async list(params: any) {
        return await this.api.list(params);
    }

}
