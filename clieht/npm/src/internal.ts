import { Coastguard, getCreds } from "./index.js";

async function getFileBinary(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (async (e) => {
            resolve(reader.result);
        });
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

async function generatePublicPrivateKey() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        true,
        ["sign", "verify"]
    )
    const publicexported = await crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
    );
    const publicexportedAsString = ab2str(publicexported);
    const publicexportedAsBase64 = btoa(publicexportedAsString);

    const privateexported = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    );
    const privateexportedAsString = ab2str(privateexported);
    const privateexportedAsBase64 = btoa(privateexportedAsString);

    return { publicKeyNaked: publicexportedAsBase64, privateKeyNaked: privateexportedAsBase64 };
}

function ab2str(buf: any) {
    return String.fromCharCode.apply(null, [...new Uint8Array(buf)]);
}

export { getFileBinary, generatePublicPrivateKey };