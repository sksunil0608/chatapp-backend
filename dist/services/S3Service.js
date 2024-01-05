"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uploadtoS3 = (buffer, key, contentType) => {
    const BUCKET_NAME = process.env.BUCKET_NAME || '';
    const IAM_USER_KEY = process.env.IAM_USER_KEY || '';
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET || '';
    let s3bucket = new aws_sdk_1.default.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, S3Response) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(S3Response.Location);
            }
        });
    });
};
exports.default = uploadtoS3;
