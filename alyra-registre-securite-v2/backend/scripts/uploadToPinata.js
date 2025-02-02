require('dotenv').config();

async function main() {
    const jsonFile = process.argv[2];
    const taskId = process.argv[3];
    const key = process.env.PINATA_KEY;
    const secret = process.env.PINATA_SECRET;
    const pinataSDK = require('@pinata/sdk');
    const pinata = new pinataSDK(key, secret);
    const fs= require('fs');
    const readableStreamForFile = fs.createReadStream(jsonFile);

    const options = {
        pinataMetadata: {
            name: `taskId-${taskId}`,
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        const body = {
            description: "Vérification - Registre de sécurité.",
            metadata: result.IpfsHash,
            name: "Vérification task ID " + taskId,
        };

        pinata.pinJSONToIPFS(body, options).then((json) => {
            console.log(json);
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
    });
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})