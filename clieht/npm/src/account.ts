import { Coastguard, getCreds } from "./index.js";
import { getPlatformApiURLWithoutPathname } from "./routing.js";

async function me(): Promise<any> {
    const response = await Coastguard(getCreds()).fetch_wrapper(`${getPlatformApiURLWithoutPathname()}/account/me`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    
    const json = response.json();
    if (response.status !== 200) {
        throw json;
    }
    return json;
}

async function update(data: object): Promise<any> {
    const response = await Coastguard(getCreds()).fetch_wrapper(`${getPlatformApiURLWithoutPathname()}/account/update`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: 'error', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    
    const json = response.json();
    if (response.status !== 200) {
        throw json;
    }
    return json;
}

const account = { me, update };
export default account;