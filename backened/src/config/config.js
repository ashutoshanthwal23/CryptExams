import {config as configDotenv} from "dotenv"
configDotenv()

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    acccessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    frontendApiUrl: process.env.FRONTEND_API_URL,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudName: process.env.CLOUD_NAME,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER,
    nodemailerService: process.env.NODEMAILER_MAIL_SERVICE,
    nodemailerUser: process.env.NODEMAILER_USER_MAIL,
    nodemailerPassword: process.env.NODEMAILER_PASSWORD
}

export const config = Object.freeze(_config);