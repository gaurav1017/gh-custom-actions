const core = require('@actions/core');
const fs = require('fs');

const {
  S3Client,
  PutObjectCommand
} = require('@aws-sdk/client-s3');

async function run() {

  try {

    core.notice("Starting upload to Cloudflare R2...");

    const client = new S3Client({
      region: 'auto',

      endpoint: process.env.R2_ENDPOINT,

      forcePathStyle: true,

      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // file you want to upload
    const fileContent = fs.readFileSync('../../../../dist/index.html');

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'index.html',
      Body: fileContent,
      ContentType: 'text/html',
    });

    await client.send(command);

    core.notice("File uploaded successfully!");

  } catch (error) {

    core.setFailed(error.message);

  }
}

run();