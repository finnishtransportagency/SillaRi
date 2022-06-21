console.log('Loading function');

const AWS = require('aws-sdk');
const ktvRemoverClient = require('./ktvRemoverClient');
const region = 'eu-west-1';
const secretClient = new AWS.SecretsManager({
    region: region
});


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    try {
        const secret = await getSecret();
        console.log('got secret');

        const secretJSON = secret.SecretString;
        const parsed = JSON.parse(secretJSON);
        const apiKey = parsed['kvt-api-key'];

        //supervision_100_SIL-img-101 -> SIL-img-10
        const keyParts = key ? key.split('_') : [];
        console.log('keyParts: ' + keyParts);

        const ktvIdentifier = keyParts[2] || null;

        if (!ktvIdentifier) {
            console.error("Illegal key: " + key);
            return 0;
        }

        await ktvRemoverClient.removeFileFromKVT(apiKey, ktvIdentifier);

    }
    catch (error) {
        console.error(error);
        return 0;
    }
    return 1;
};

async function getSecret() {
    const sec = await secretClient.getSecretValue({ SecretId: 'arn:aws:secretsmanager:eu-west-1:384409174079:secret:api-key-for-kvt-TeLyiL' }).promise();
    console.log('*** SECRET WAS FETCHED FROM SECRETS MANAGER');
    return sec;
}
