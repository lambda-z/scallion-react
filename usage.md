
# How to Use

## Request

Set backend service url.
You can config it in `.env` file.

```text
NEXT_PUBLIC_BACKEND_SERVICE_URL=http://127.0.0.1:8000
```

This step is depended on the Request config. You can use this component to check whether your backend service  that you
config above is available.
```tsx
import {BackendServiceCheck} from "scallion-react";

function App() {
    return (
        <div>
            <BackendServiceCheck/>
        </div>
    )
}
```
## DRFApi

Basing on the base DRFApi, you can write your custom Api class to meet your concrete business requirements.

```tsx

class BackendServiceMetaApi extends DRFApi {

    URL = '/health';

    async getHealth() {
        return await request.get(this.URL, {});
    }

}
```

## DRFService

Basing on DRFServiceImpl, you can realize your concrete business service impl.

```tsx
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
```
