

export class ScallionLocalStorageUtil {
    // set
    public static set(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    // get
    public static get(key: string) {
        return window.localStorage.getItem(key);
    }

    // remove
    public static remove(key: string) {
        window.localStorage.removeItem(key);
    }
}
