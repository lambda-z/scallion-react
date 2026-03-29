# Scallion React

```bash
  ____            _ _ _                 ____                 _   
/ ___|  ___ __ _| | (_) ___  _ __     |  _ \ ___  __ _  ___| |_
\___ \ / __/ _` | | | |/ _ \| '_ \    | |_) / _ \/ _` |/ __| __|
___) | (_| (_| | | | | (_) | | | |   |  _ <  __/ (_| | (__| |_
|____/ \___\__,_|_|_|_|\___/|_| |_|   |_| \_\___|\__,_|\___|\__|
```
## Installation

```bash
npm install git@github.com:lambda-z/scallion-react.git#main
```

If this lib has been installed before, you can update it by:
```bash
npm uninstall scallion-react
npm install git@github.com:lambda-z/scallion-react.git#main
```



# Quick Start

## 1. Request

### 1.1 Backend Service Url.
Set backend service url.
You can config it in `.env` file.

In next app:
```text
NEXT_PUBLIC_BACKEND_SERVICE_URL=http://127.0.0.1:8000
```

In expo rn app:
```text
EXPO_PUBLIC_BACKEND_SERVICE_URL=http://127.0.0.1:8000
```

### 1.2 Config ScallionStorageAdapter.
**In ReactNative:**

#### Step 1: Install Storage Package & Creating ScallionStorageAdapter Instance
- Install `expo-secure-store`.
```bash
npx expo install expo-secure-store
```

- Create file in `adapter.tsx`

In react native.
```tsx
import * as SecureStore from 'expo-secure-store';

import {
    ScallionStorageAdapter,
} from 'scallion-react';

export const rnStorageAdapter: ScallionStorageAdapter = {
    async set(key: string, value: string) {
        await SecureStore.setItemAsync(key, value);
    },
    async get(key: string) {
        return await SecureStore.getItemAsync(key);
    },
    async remove(key: string) {
        await SecureStore.deleteItemAsync(key);
    },
};
```

In react web:
```ts
export class ScallionStorageUtil {
  public static async set(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value);
  }

  public static async get(key: string): Promise<string | null> {
    return window.localStorage.getItem(key);
  }

  public static async remove(key: string): Promise<void> {
    window.localStorage.removeItem(key);
  }
}
```

#### Step 2: setScallionStorageAdapter

For instance, in expo file router mode.
`app/_layout.tsx`
```tsx
import {setScallionStorageAdapter} from "scallion-react";
import {rnStorageAdapter} from "@/adapter/rnStorageAdapter";

setScallionStorageAdapter(rnStorageAdapter);
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

## Project Structure

The following function location is referenced by this framework.

- src/api/
- src/service/
- src/hook/
- src/views/
- src/model(s)/
- src/component(s)/
- src/provider/


## AI Prompt

When you implement a new `DOMAIN` in your react(next) project, you can use the following prompt text.

```markdown
- You are a senior next developer.
- Now you should implement a basic concrete domain react display framework.
- The DOMAIN var is a giving domain name, you should replace the var in {DOMAIN} I mentioned later.
- {DOMAIN} is the domain's snack naming, such as `user_info`;
- {DOMAIN_BIG_CAMEL} is the big camel naming of the domain, for example, `UserInfo`;
- {DOMAIN_SMALL_CAMEL} is the big camel naming of the domain, for example, `userInfo`;
- {DOMAINS} is the domain's 复数, for example, user_info -> user_infos, fox -> foxes.
- The Base URL var is {BASE_URL}, for instance, /api/data/v1/

In `src/api/{DOMAIN_BIG_CAMEL}Api.ts`:

import {DRFApi} from "scallion-react";

export class {DOMAIN_BIG_CAMEL}Api extends DRFApi {
    URL = '/{BASE_URL}/{DOMAINS}';
}

In `src/service/{DOMAIN_BIG_CAMEL}ServiceImpl.ts`:

import { DRFServiceImpl } from "scallion-react";
import { {DOMAIN_BIG_CAMEL}Api } from "@/src/api/{DOMAIN_BIG_CAMEL}Api";

export class {DOMAIN_BIG_CAMEL}ServiceImpl extends DRFServiceImpl {
    api = new {DOMAIN_BIG_CAMEL}Api();
}

In `src/service/{DOMAIN_BIG_CAMEL}.ts`:

export type {DOMAIN_BIG_CAMEL} = {
    id: number;
}

In `src/hook/use{DOMAIN_BIG_CAMEL}.tsx`:
import {useState} from "react";
import {{DOMAIN_BIG_CAMEL}ServiceImpl} from "@/src/service/AuthServiceImpl";

export function use{DOMAIN_BIG_CAMEL}() {
    const service = new {DOMAIN_BIG_CAMEL}ServiceImpl();
    
    return {
        service,
    }
}

- 严格控制输出：只输出一个json，key为文件相对路径及文件名，value为文件内容。

DOMAIN='flashcard'
BASE_URL='/api/[]'
```
