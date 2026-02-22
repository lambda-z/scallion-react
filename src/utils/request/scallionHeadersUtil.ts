import {ScallionLocalStorageUtil} from "../storage";


class ScallionHeadersUtil {

    static getBearerAuthorization() {
        return "Bearer " + ScallionLocalStorageUtil.get("token")
    }

    static getJsonHeader() {
        return {
            "Content-Type": "application/json",
            Authorization: ScallionHeadersUtil.getBearerAuthorization(),
        }
    }

    static getFileHeader() {
        return {
            'Content-Type': 'multipart/form-data',
            Authorization: ScallionHeadersUtil.getBearerAuthorization(),
        }
    }
}

export default {ScallionHeadersUtil};
