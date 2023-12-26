// gcp creds
const path = require("path");
const bucketName = process.env.GCP_FILESTORAGE_BUCKETNAME;
const keyFilename = path.join(
    __dirname,
    `../${process.env.GCP_FILESTORAGE_CREDSFILE}`
);
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename });

// azure
const { BlobServiceClient, ContainerClient } = require("@azure/storage-blob");

/**
 * @param {*} file 
 * @returns 
 * @description file_name is the name which will be display in the GCP storage bucket.
 * file arg is the data that content whole file data.
 */
// GCP file upload
exports.uploadGCPFile = async (file) => {
    try {
        const file_name = file.originalname;
        const uploadFile = storage.bucket(bucketName).file(`${file_name}`);

        await uploadFile.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        const viewUrl = `https://storage.googleapis.com/${bucketName}/${file_name}`;
        return viewUrl;
    } catch (error) {
        console.log(error.toString());
        throw error;
    }
};

// // azure
// exports.uploadAzureFile = async (file) => {
//     try {

//         const blobClientService = await BlobServiceClient.fromConnectionString(
//             process.env.AZURE_CONNECTION_STRING
//         );
//         const containerClient = blobClientService.getContainerClient(process.env.AZURE_CONTAINER_NAME);
//         const file_name = file.originalname;
//         const blockBlobClient = await containerClient.getBlockBlobClient(
//             file_name
//         );
//         const fileUrl = blockBlobClient.url;
//         await blockBlobClient.uploadData(file.buffer, {
//             blobHTTPHeaders: {
//                 blobContentType: file.mimetype,
//             },
//         });

//         return fileUrl;
//     } catch (error) {
//         console.log(error.toString());
//         throw error;
//     }
// }

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const AWSCREDS = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
    region: process.env.AWS_REGION,
};

const s3 = new S3Client(AWSCREDS);

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKETNAME,
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName =
            Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    },
    contentType: (req, file, cb) => {
        cb(null, file.mimetype);
    },
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg"];

    let fileextension = path.extname(file.originalname.toLowerCase());
    const isAllowedExt = fileExts.includes(fileextension);
    const isAllowedMimeType = file.mimetype.startsWith("image/");
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb(`File TYPE ${fileextension.replace(".", "")} IS NOT THE IMAGE`);
    }
}

const uploadImage1 = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5mb file size
    },
});

// aws along with upload file
exports.uploadImageAws = async (req, res) => {

    uploadImage1.single("image")(req, res, async function (err) {
        try {

            if (!(await req.file)) {
                return false;
            }

            let url = await req.file.location;

            return url;
        } catch (error) {
            console.log(error);
            throw error;
        }
    });
};
