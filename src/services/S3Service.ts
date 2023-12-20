import AWS from 'aws-sdk';

interface UploadParams {
    Bucket: string;
    Key: string;
    Body: any;
    ContentType: any; // Correct property name
    ACL: string;
}

const uploadtoS3 = (buffer: Buffer, key: string, contentType: any): Promise<string> => {
    const BUCKET_NAME = process.env.BUCKET_NAME || '';
    const IAM_USER_KEY = process.env.IAM_USER_KEY || '';
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET || '';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

    const params: UploadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType, // Correct property name
        ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err: Error, S3Response: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(S3Response.Location);
            }
            // Close the connection by destroying the underlying HTTP agent
        });
    });
};

export default uploadtoS3;
