console.log("Loading function");

const AWS = require("aws-sdk");
const ktvClient = require("./ktvClient");
const region = "eu-west-1";
const secretClient = new AWS.SecretsManager({
  region: region,
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event, context) => {
  //await bootstrap()

  //console.log('Hello Received event:', JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const imageKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  console.log("bucket", bucket);
  const params = {
    Bucket: bucket,
    Key: imageKey,
  };

  try {
    //const sec = await secretClient.getSecretValue({ SecretId: secretName }).promise();
    const secret = await getSecret();

    console.log("got secret");

    const secretJSON = secret.SecretString;
    const parsed = JSON.parse(secretJSON);
    const apiKey = parsed["kvt-api-key"];
    console.log("key", apiKey);

    const { Body } = await s3.getObject(params).promise();
    console.log("got body");

    // Convert Body from a Buffer to a String
    const objectData = Body.toString("base64"); // Use the encoding necessary
    //let objectData = Buffer.from(Body, 'base64');

    const callbackHelvetti = () => {
      console.log("HELLO CALLBACK");
    };

    //console.log(objectData);

    await ktvClient.postFileToKVT(
      objectData,
      apiKey,
      imageKey,
      callbackHelvetti
    );
    //await postFileToKVT(objectData, apiKey, imageKey, callbackHelvetti);
  } catch (error) {
    console.error(error);
  }
  //console.log("here");

  //return 1;
};

async function getSecret() {
  //   const secret = process.env["STORED_SECRET"];

  //   if (secret) {
  //     console.log("*** SECRET WAS IN THE CACHE");
  //     return secret;
  //   }

  const sec = await secretClient
    .getSecretValue({
      SecretId:
        "arn:aws:secretsmanager:eu-west-1:384409174079:secret:api-key-for-kvt-TeLyiL",
    })
    .promise();
  console.log("*** SECRET WAS FETCHED FROM SECRETS MANAGER");
  return sec;
}

async function bootstrap() {
  const secret = await getSecret();
  process.env.STORED_SECRET = secret;
}
