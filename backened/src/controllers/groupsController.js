import { GroupsDTO } from "../dto/groupsDto.js";
import Groups from "../models/group.js"
import createHttpError from "http-errors";
import authService from "../services/authService.js";
import userService from "../services/userService.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/nodemailer.js";

class GroupsController {
    // create group
    async create(req, res, next){
        const { name, description} = req.body;

        try{
            const group = await Groups.create({
                name,
                description,
                owner: req.user.id
            });
            const populatedGrp = await Groups.findById(group._id).populate("owner").exec();

            return res.json({ group: new GroupsDTO(populatedGrp) });
        } catch(err){
            const error = createHttpError(500, err.message)
            return next(error);
        }
    }

    // get all groups

    async getAllGroups(req, res, next){
        try{
            const groups = await Groups.find({ owner: req.user.id });
            const groupInfo = [];
            groups.forEach(grp => {
                const filteredGrp = {
                    id: grp._id,
                    name: grp.name,
                    description: grp.description,
                }
                groupInfo.push(filteredGrp);
            })

            return res.json({groups: groupInfo});
            
        } catch(err){
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }

    // get particular group 
    async getGroup(req, res, next){
        try{
            const group =  await Groups.findById(req.params.id).populate("studentsList").populate("owner").exec();
           if(group.owner.id.toString() !== req.user.id.toString()){
            return next(createHttpError(400, "unauthorised"));
           }

            res.json({group: new GroupsDTO(group)})
        }catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    // add student to group

    async addStudent(req, res, next){
        try{
            const groupExist = await Groups.findById(req.params.id);
            if(!groupExist){
                return next(createHttpError(500, "something went wrong"));
            }

            if(groupExist.owner.toString() !== req.user.id.toString()){
                return next(createHttpError(400, "unauthorised"));
            }

            let studentFound = false;
            let student = await userService.findByRollNumber(req.body.rollNumber);
            if(student){
                studentFound = true;
            }

            if(!student){
                const passwordString = "abcdefghijklmnopqrstuvwxyz0123456789";
                let password = "";
                for(let i = 1; i <= 6; i++){
                    const idx = Math.floor(Math.random() * 38);
                    password += passwordString[idx]
                }

                student = await authService.create({...req.body, password, role: "student"});
                if(!studentFound){
                    // send email
                    const emailBody = {
                        name: student.name,
                        email: student.email,
                        mobile: student.mobile,
                        password: password
                    }
                   
                    await sendEmail(student.email, "Your Account Details - Cryptexams", emailBody);
                }
            }
            
            const studentFoundInGrp = groupExist.studentsList.some(rollNo => rollNo.toString() === student._id.toString());
            if(studentFoundInGrp){
                return next(createHttpError(409, "student already exist"));
            }
            const group = await Groups.findByIdAndUpdate(req.params.id,
                { $push: {studentsList: student._id }},
                { new: true }
            )

            const updatedStudent = await userService.addGroupId(group._id, student._id);

            res.json({student: updatedStudent, group})

        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    // remove student from group
    async removeStudent(req, res, next){
        try{
            const studentId = req.params.studentId;
            const groupId = req.params.groupId;

            const groupExist = await Groups.findById(groupId);
            if(!groupExist){
                return next(createHttpError(500, "something went wrong"));
            }

            if(groupExist.owner.toString() !== req.user.id.toString()){
                return next(createHttpError(400, "unauthorised"));
            }

            let student = await userService.findById(studentId);
            if(!student){
                return next(createHttpError(400, "student doesn't exist"));
            }

            if(!groupExist.studentsList.includes(studentId)){
                return next(createHttpError(400, "student doesn't exist in group"));
            }

            student = await User.findByIdAndUpdate(studentId,
                { $pull: { groupsList: groupId }},
                { new: true }
            )

            const groups = await Groups.findByIdAndUpdate(
                groupId,
                { $pull: { studentsList: studentId}},
                { new: true }
            );

            await User.findByIdAndDelete(student._id);

            res.json({groups, student})

        } catch(err){
            return next(createHttpError(500, err.message));
        }
    }

    async getStudentGroups(req, res, next){
        try{
            const userId = req.user.id;
            const groups = await Groups.find({
                studentsList: {$in: [userId]}
              }).populate("owner");
              
              const groupsInfo = [];
              groups.forEach(grp => {
                    const info = {
                        id: grp._id,
                        name: grp.name,
                        description: grp.description,
                        owner: {
                            id: grp.owner._id,
                            name: grp.owner.name,
                            mobile: grp.owner.mobile,
                            email: grp.owner.email
                        }
                    }
                    groupsInfo.push(info);
            })
            res.json({ groups:groupsInfo });
        } catch(err){
            const error = createHttpError(500, err.message);
            return next(error);
        }
    }
}

export default new GroupsController();