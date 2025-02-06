import { getPlatformApiURLWithoutPathname } from "./routing.js";
import device from "./device.js";
import fetch_wrapper from "./fetcher.js";
import general from "./general.js";
declare function getCreds(): {
    deviceid: string | null;
    privatekey: string;
    additional_data: any;
    type: string | null;
    fetch_properties: any;
};
declare function OnlyGetAdditionalData(): Promise<{}>;
declare function Coastguard(credsObject: any): {
    getCreds: typeof getCreds;
    device: typeof device;
    fetch_wrapper: typeof fetch_wrapper;
    general: typeof general;
    account: {
        me: () => Promise<any>;
        update: (data: object) => Promise<any>;
    };
    error: {
        list: (id?: string[]) => Promise<any>;
    };
    discussion: {
        list: (id: string[] | undefined, filter: any) => Promise<any>;
        update: (actions: object) => Promise<any>;
    };
    event: {
        list: (id: string[] | undefined, filter: any) => Promise<any>;
        create: (data: object) => Promise<any>;
    };
    org: {
        list: (id?: string[]) => Promise<any>;
    };
    namespace: {
        list: (id?: string[]) => Promise<any>;
    };
    project: {
        list: (id?: string[]) => Promise<any>;
    };
    user_rating: {
        list: (id: string[] | undefined, filter: any) => Promise<any>;
        update: (actions: object) => Promise<any>;
    };
    getPlatformApiURLWithoutPathname: typeof getPlatformApiURLWithoutPathname;
};
export { Coastguard, getCreds, OnlyGetAdditionalData };
