import { uploadEncryptedPdfToCloudinary, uploadFile } from "../cloudinary/cloudinary.js";
import fs from "fs/promises"
import Test from "../models/test.js"
import { makeId } from "../utils/utils.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import createHttpError from "http-errors";
import Group from "../models/group.js";
import { convertDateToIST, convertISTtoUTC, convertTimeToIST } from "../utils/date.js";
import { sendMessageByTwilio } from "../twilio/sendMessage.js";
import { getResult } from "../utils/result.js";
import { addPasswordToPdf } from "../utils/pdfProtection.js";
import pdf2base64 from "pdf-to-base64"
import axios from "axios";
import User from "../models/userModel.js";
import { deleteFile } from "../utils/deleteFile.js";

class TestController {
    async uploadTest(req, res, next){
        try{
            if (!req.file) {
                return next(createHttpError(400, "no file uploaded"));
            }

            const questionPdf = req.file.buffer;
            const outputFileName = makeId(10);

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const filePath = path.resolve(__dirname, `../uploads/inputPdf/test.pdf`);

            await fs.writeFile(filePath, questionPdf);

            // 1. Add password to the PDF
            const destPath = path.resolve(__dirname, `../uploads/outputPdf/${outputFileName}.pdf`);
            await addPasswordToPdf(filePath, destPath, req.body.password);

            // 2. Convert PDF to base64
            let base64Content = await pdf2base64(destPath); 
            const encryptedFilePath = path.resolve(__dirname, '../uploads/encrypted.txt');
            await fs.writeFile(encryptedFilePath, base64Content, {flag: 'w'});

            // 3. Upload the encrypted PDF to Cloudinary
            const encryptedUrl = await uploadEncryptedPdfToCloudinary(encryptedFilePath);

            const startTime = convertISTtoUTC(req.body.date, req.body.startTime);
            const endTime = convertISTtoUTC(req.body.date, req.body.endTime);

            const uploadedFileUrl = await uploadFile(questionPdf);
            
            await Test.create({
                name: req.body.testName,
                description: req.body.description,
                owner: req.user.id,
                group: req.query.groupId,
                date: new Date(`${req.body.date}T00:00:00+05:30`),
                startTime,
                endTime,
                originalQuestionPaper: uploadedFileUrl,
                encryptedQuestionPaper: encryptedUrl,
                pdfPassword: req.body.password
            })

            await deleteFile(destPath);
            await deleteFile(filePath);
            await deleteFile(encryptedFilePath);

            res.json({success: true})
        } catch(err){
            console.log(err);
            return next(createHttpError(500, err.message));
        }
    }

    async viewAllTest(req, res, next){
        try{
            const groupIds = await User.findOne(
                { _id: req.user.id },
                { groupsList: 1, _id: 0}
            );

            const groupsIds = groupIds.groupsList.map(id => id.toString());

            const testInfo = [];
            
            for (const group of groupsIds) {
                const allTest = await Test.find({ group }).populate("group").populate("owner");

                for(const test of allTest){
                    const date = convertDateToIST(test.date);
                    const startTime = convertTimeToIST(test.startTime)
                    const endTime = convertTimeToIST(test.endTime)
    
                    const options = {
                        id: test._id,
                        name: test.name,
                        description: test.description,
                        date,
                        startTime,
                        endTime,
                        group: {
                            id: test.group._id,
                            name: test.group.name,
                            description: test.group.description
                        },
                        owner: {
                            id: test.owner._id,
                            name: test.owner.name,
                            email: test.owner.email,
                            mobile: test.owner.mobile
                        }
                    }

                    testInfo.push(options);
                }
                    
            }

            return res.json({testInfo})
        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async studentViewTest(req, res, next){
        try{
            const test = await Test.findById(req.params.id).populate("owner").populate("group");
            if(!test){
                return next(createHttpError(400, "Test not found"));
            }

            const response = await axios.get(test.encryptedQuestionPaper);

            const date = convertDateToIST(test.date);
            const startTime = convertTimeToIST(test.startTime)
            const endTime = convertTimeToIST(test.endTime)

            const student = await User.findById(req.user.id);

            let answerSubmit = false;
            if(student){
                answerSubmit = test.answerSubmit.some(element => element.rollNumber === student.rollNumber);
            }

            const options = {
                id: test._id,
                name: test.name,
                description: test.description,
                date,
                startTime,
                endTime,
                answerSubmit,
                group: {
                    id: test.group._id,
                    name: test.group.name,
                    description: test.group.description
                },
                owner: {
                    id: test.owner._id,
                    name: test.owner.name,
                    email: test.owner.email,
                    mobile: test.owner.mobile
                },
                questionPaper: `${response.data}`
            }

            res.json({test: options});
        } catch(err){
            return next(createHttpError(500, err.message))
        }
    }

    async teacherAllTests(req, res, next){
        try{
            const allTests = await Test.find({ owner: req.user.id }).populate("group");

            const testInfo = [];
            for(const test of allTests){
                const date = convertDateToIST(test.date);
                const startTime = convertTimeToIST(test.startTime)
                const endTime = convertTimeToIST(test.endTime)

                const options = {
                    id: test._id,
                    name: test.name,
                    description: test.description,
                    date,
                    startTime,
                    endTime,
                    group: {
                        id: test.group._id,
                        name: test.group.name,
                        description: test.group.description
                    }
                }
                testInfo.push(options);
            }

            return res.json({testInfo});

        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async viewTest(req, res, next){
        try{
            const test = await Test.findById(req.params.id);
            const date = convertDateToIST(test.date);
            const startTime = convertTimeToIST(test.startTime)
            const endTime = convertTimeToIST(test.endTime)

            const response = await axios.get(test.encryptedQuestionPaper);

            const options = {
                id: test._id,
                name: test.name,
                description: test.description,
                date,
                startTime,
                endTime,
                originalQuestionPaper: test.originalQuestionPaper,
                encryptedQuestionPaper: `data:application/pdf;base64,${response.data}`,
                password: test.pdfPassword,
                group: test.group,
                answerPdf: test.answerSubmit,
                shaKeys: test.shaKeySubmit
            }

            return res.json({test: options})
        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async testResult(req, res, next){
        try{
            const test = await Test.findById(req.params.id);
            const keyArray = test.shaKeySubmit;
            const answerPdfArray = test.answerSubmit;
            const startTime = test.startTime;
            const endTime = test.endTime;
            const examDate = test.date;
            const sendMessageStatus = test.sendMessageStatus;
            const result = await getResult(keyArray, answerPdfArray, startTime, endTime, examDate, sendMessageStatus);
            res.json({result});

        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async sendMessageToStudents(req, res, next){
        try{
            const testId = req.params.testId;
            const test = await Test.findById(testId);
            if(test.sendMessageOneTime){
                return next(createHttpError(400, "you have already sent message to all students"));
            }

            const questionPaperPassword = test.pdfPassword;
            const groupId = test.group;

            const groupData = await Group.findById(groupId).populate({ path: "studentsList", select: 'name mobile rollNumber -_id'});
            
            const studentsList = groupData.studentsList;

            const studentsNumbers = [];
            studentsList.forEach(student => {
                studentsNumbers.push("+91"+student.mobile);
            })

            test.sendMessageOneTime = true;
            await test.save();

            await sendMessageByTwilio(studentsList, questionPaperPassword, testId);
            res.json({msg: "message sent to all students"})

        }
        catch(err){
            return next(createHttpError(500, err.message));
        }
    }
}

export default new TestController();