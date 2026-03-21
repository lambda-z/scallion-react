import { getScallionStorageAdapter } from "../storage";

export class ScallionHeadersUtil {
    static async getBearerAuthorization(): Promise<string | undefined> {
        const storage = getScallionStorageAdapter();
        const token = await storage.get("token");
        return token ? `Bearer ${token}` : undefined;
    }

    static async getJsonHeader(): Promise<Record<string, string>> {
        const authorization = await ScallionHeadersUtil.getBearerAuthorization();

        return {
            "Content-Type": "application/json",
            ...(authorization ? { Authorization: authorization } : {}),
        };
    }

    static async getFileHeader(): Promise<Record<string, string>> {
        const authorization = await ScallionHeadersUtil.getBearerAuthorization();

        return {
            "Content-Type": "multipart/form-data",
            ...(authorization ? { Authorization: authorization } : {}),
        };
    }
}
