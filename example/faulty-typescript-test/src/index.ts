import { Coastguard } from "coast-guard";

const authentication = {
    deviceid: "[your device id]",
    privatekey: process.env["[your privatekey as an environment variable]"],
    additional_data: { project_id: "[your project id]", endpoint: "[your coastguard server]" }
};

async function main() {
    // Log script startup as a Coastguard event.
    const response = await Coastguard(authentication)
    .event.create({ actions: [{
        type: "request",
        nonce: "Startup",
        alias: "Startup",
        content: `Startup at ${new Date().toLocaleDateString()}`,
        metadata: {
            user: {
                email: "my_app_user@example.com",
                ip: "0.0.0.0",
                cool_embed_object: {
                    you_can_put_anything_you_want_here: "yeah!"
                }
            }
        }}
    ]});

    // Deliberately throw error and log it in Coastguard.
    try {
        throw new Error("This is a deliberately thrown error!");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Caught an error:", error.message);
            await sendErrorDetails(error);
        } else {
            console.error("Unknown error type caught.");
        }
    }
}

async function sendErrorDetails(error: Error): Promise<void> {
    // Get necssary details about the error, rather than waste bandwidth sending the entire error object.
    const errorPayload = {
        message: error.message,
        stack: error.stack || "No stack trace available",
        timestamp: new Date().toISOString()
    };

    const stackTrace = errorPayload.stack.split("\n").slice(1).join("\n").trimStart();
    const response = await Coastguard(authentication)
    .event.create({ actions: [{
        type: "error",
        nonce: stackTrace,
        alias: errorPayload.message,
        content: JSON.stringify(errorPayload),
        metadata: {
            user: {
                email: "hi@example.com",
                cool_embed_object: {
                    cool: "coolest"
                }
            }
        }} 
    ]});

    console.log("Error details sent successfully.");
}

main();
