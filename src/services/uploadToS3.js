const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mov", "video/avi"];

const uploadToS3 = async (file) => {
    const { buffer, mimetype, originalname } = file;

    // Validate type
    const isPhoto = ALLOWED_PHOTO_TYPES.includes(mimetype);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimetype);

    if (!isPhoto && !isVideo) {
        throw new Error("Invalid file type. Only photos and videos allowed.");
    }

    // Folder separation
    const folder = isPhoto ? "gallery/photos" : "gallery/videos";
    const ext = path.extname(originalname);
    const fileName = `${folder}/${uuidv4()}${ext}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype,
        // ACL: "public-read", // uncomment if your bucket is public
    };

    const result = await s3.upload(params).promise();

    return {
        url: result.Location,
        key: result.Key,                            // save this to delete later
        type: isPhoto ? "photo" : "video",
    };
};

const deleteFromS3 = async (key) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    await s3.deleteObject(params).promise();
};

module.exports = { uploadToS3, deleteFromS3 };