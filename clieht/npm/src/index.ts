import { getPlatformApiURLWithoutPathname } from "./routing.js";
import account from "./account.js";
import device from "./device.js";
import fetch_wrapper from "./fetcher.js";
import general from "./general.js";
import issue from "./issue.js";
import discussion from "./discussion.js";
import event from "./event.js";
import org from "./org.js";
import namespace from "./namespace.js";
import project from "./project.js";
import user_rating from "./user_rating.js";

let deviceIDG: string | null = null;
let privateKeyG: string | null = null;
let typeG: string | null = null;
let additional_data: any | null = null;
let fetch_properties: any = null;

function getCreds() {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";

    return {
        deviceid: deviceIDG,
        privatekey: pemHeader+privateKeyG+pemFooter,
        additional_data: additional_data,
        type: typeG,
        fetch_properties: fetch_properties
    };
}

async function OnlyGetAdditionalData() {
    // The getCreds function returns null for safety, however some parts of the codebase might still need something from the additional data object, such as a domain for local development.
    let additional_data_v = {};
    if (additional_data_v) {
        additional_data_v = additional_data_v;
    }
    return additional_data_v
}

function Coastguard(credsObject: any) {
    if (credsObject) {
        deviceIDG = credsObject.deviceid;
        privateKeyG = credsObject.privatekey;
        additional_data = credsObject.additional_data;
        typeG = credsObject.type;
        fetch_properties = credsObject.fetch_properties;
    } else {
        console.warn("You need to specify a credentials object when initalizing Coastguard(). E.g Coastguard({ deviceID \"myawesomedeviceid\", \"privatekey\":\"awesomeprivatekey\"})");
    }

    return {
        getCreds: getCreds,
        device: device,
        fetch_wrapper: fetch_wrapper,
        general: general,
        account: account,
        issue: issue,
        discussion: discussion,
        event: event,
        org: org,
        namespace: namespace,
        project: project,
        user_rating: user_rating,
        getPlatformApiURLWithoutPathname
    };
}

export { Coastguard, getCreds, OnlyGetAdditionalData };