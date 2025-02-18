import { v2 as cloudinary } from 'cloudinary';
import createHttpError from 'http-errors';
import { config } from '../config/config.js';
import { Readable } from 'stream';

 // Configuration
 cloudinary.config({ 
    cloud_name: config.cloudName, 
    api_key: config.cloudinaryApiKey, 
    api_secret: config.cloudinaryApiSecret 
});


export function uploadFile(data) {
    return new Promise((resolve, reject) => {
        const fileStream = Readable.from(data);

        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'exam-pdf'
        }, function(error, result){
            if(error){
                reject(createHttpError(500, error.message)) 
            }
            else{
                resolve(result.secure_url);
            }
        });
        fileStream.pipe(uploadStream);
    })
  }
  

  export function uploadEncryptedPdfToCloudinary(data) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(data, {
            folder: 'encrypted-question-paper', 
            resource_type: 'raw'
        }, function(error, result) {
            if (error) {
                console.log(error);
                reject(createHttpError(500, error.message));
            } else {
                resolve(result.secure_url);
            }
        });
    });
}