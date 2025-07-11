import general from "./general.js";
import { Coastguard, getCreds } from "./index.js";
import { getPlatformApiURLWithoutPathname } from "./routing.js";

async function list(id: string[] = []): Promise<any> {
    id = general().filter_nonsense(id);
    const response = await Coastguard(getCreds()).fetch_wrapper(`${getPlatformApiURLWithoutPathname()}/namespace/list?${general().objectToParams({ id })}`, {
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

const namespace = { list };
export default namespace;