import express from "express"
import globalErrorHandler from "./middlewares/globalErrorHandler.js"
import authRoute from "./routes/authRoute.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "./config/config.js"
import groupRoute from "./routes/groupRoute.js"
import testRoute from "./routes/testRoute.js"
import answerRoute from "./routes/answer.js"
import upload from "./middlewares/multer.js"

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({ credentials: true, origin: config.frontendApiUrl}));


app.get("/", (_, res) => {
    res.send("this is a message from server");
})

app.use("/auth", authRoute);
app.use("/groups", groupRoute);
app.use("/test", testRoute);
app.use("/student", answerRoute)

app.post("/answer", upload.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file)
     res.send("Answer submitted successfully");
 })
 
 app.post('/message', (req, res) => {
     const { originatingAddress, body, timestamp } = req.body;
   
     // Log the received SMS details
     console.log(`Received SMS from ${originatingAddress}: ${body} at ${new Date(timestamp).toISOString()}`);
   
     // Validate incoming data
     if (!originatingAddress || !body || !timestamp) {
       console.error('Invalid request: Missing required fields');
       return res.status(400).json({ error: 'Invalid request: Missing required fields' });
     }
   
     // Simulate processing the message (e.g., saving to a database)
     try {
       // Add your processing logic here
       console.log('Processing SMS message...');
   
       // Send a success response
       res.status(200).json({ message: 'SMS received successfully' });
     } catch (error) {
       console.error('Failed to process SMS message', error);
       res.status(500).json({ error: 'Failed to process SMS message' });
     }
   });

app.use(globalErrorHandler)

export default app;


