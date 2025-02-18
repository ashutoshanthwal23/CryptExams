import axios from 'axios';
import crypto from 'crypto';
import createHttpError from 'http-errors';

export const generateSha256Key = async (pdfUrl) => {
    try {
        // Fetch the PDF content as base64 encoded string
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        // Convert array buffer to base64 string
        const base64String = Buffer.from(response.data).toString('base64');

        // Create SHA-256 hash
        const hash = crypto.createHash('sha256');
        hash.update(base64String);
        const shaKey = hash.digest('hex'); // Use 'hex' encoding to match React Native

        return shaKey;
    } catch (err) {
        throw createHttpError(500, err.message);
    }
};