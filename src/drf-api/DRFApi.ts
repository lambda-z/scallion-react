import {request} from "../utils/request";

export class DRFApi {

    public URL: string = '';

    create = async (params?: any) => {
        const url = this.URL;
        return await request.post(
            url,
            params || {},
        );
    };

    list = async (params?: any) =>  {
        const url = this.URL;
        return await request.get(
            url,
            {
                params: params || {},
            }
        );
    }

    update = async (id: number, params?: any) => {
        return await request.patch(
            this.URL + "/" + id,
            params || {},
        );
    };

    destroy = async (id: number, params?: any) => {
        return await request.delete(
            this.URL + "/" + id,
            {
                params: params || {},
            }
        );
    };

    retrieve = async (id: number, params?: any) => {
        return await request.get(
            this.URL + "/" + id,
            {
                params: params || {},
            }
        );
    };

}
