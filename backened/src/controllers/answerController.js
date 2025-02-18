import createHttpError from "http-errors";
import { uploadFile } from "../cloudinary/cloudinary.js";
import Test from "../models/test.js";
import { getTwilioSMSDetails } from "../utils/utils.js";

class AnswerController {
    async submitKey(req, res, next){
        try{
            if(!req.body.body){
                return res.status(400).json({ error: 'Invalid request: Missing required fields' });
            }

            const options = getTwilioSMSDetails(req.body.body.toString());
            const test = await Test.findById(options.testId);

            const isKeySubmitted = test.shaKeySubmit.some(elem => elem.rollNumber === options.rollNumber);
            if(isKeySubmitted){
                return next(createHttpError(400, "The key has already been submitted"));
            }

            test.shaKeySubmit.push({rollNumber: options.rollNumber, key: options.key});
            await test.save();
            return res.send("Key submitted successfully");

        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async submitAnswer(req, res, next){
        try{
            
            const test = await Test.findById(req.body.testId);
            
            const isAnswerSubmitted = test.answerSubmit.some(elem => elem.rollNumber === req.body.rollNumber);
            if(isAnswerSubmitted){
                return res.send("You have already submitted answer");
            }
            const uploadedAnswerUrl = await uploadFile(req.file.buffer);

            test.answerSubmit.push({ rollNumber: req.body.rollNumber, answerSheet: uploadedAnswerUrl});
            await test.save();

            res.send("Answer submitted successfully");
        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    
}

export default new AnswerController();