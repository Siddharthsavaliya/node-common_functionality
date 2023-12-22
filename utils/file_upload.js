const bucketName = process.env.GCP_FILESTORAGE_BUCKETNAME;
const path = require("path");
const keyFilename = path.join(
    __dirname,
    `../${process.env.GCP_FILESTORAGE_CREDSFILE}`
);
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename });

// aws 
const Aws = require("aws-sdk");
const awsKeyId = process.env.AWS_KEY_ID
const awsSecreteKey = process.env.AWS_SECRET_KEY
const awsBucketName = process.env.AWS_FILESTORAGE_BUCKETNAME;

// GCP file upload
exports.uploadGCPFile = async (buffer, fileName, metadata, storageFolder) => {
    try {

        const file = storage.bucket(bucketName).file(`${storageFolder}/${fileName}`);

        await file.save(buffer, {
            metadata: metadata,
        });

        const viewUrl = `https://storage.googleapis.com/${bucketName}/files/${fileName}`;
        return viewUrl;
    } catch (error) {
        console.log(error.toString());
        return false;
    }
};

// aws file upload
exports.uploadAWSFile = async (buffer, fileName, ContentType) => {
    try {
        const s3 = new Aws.S3({
            accessKeyId: awsKeyId,
            secretAccessKey: awsSecreteKey
        });
        const params = {
            Bucket: awsBucketName,
            Key: fileName,
            Body: buffer,
            ContentType: ContentType
        }
        s3.upload(params, (error, data) => {
            if (error) {
                console.log(error.toString());
                return false;
            } else {
                console.log("file upload successful", data.Location);
                return data.Location;
            }
        })
    } catch (error) {
        console.log(error.toString());
        return false;
    }
};


