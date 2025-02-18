import createHttpError from "http-errors";
import User from "../models/userModel.js";

class UserService {
    async findByEmail(email){
        try{
            const user = await User.findOne({email});
            if(!user){
                const err = createHttpError(404, "Email or password does not match");
                throw err;
            }
            return user;
        } catch(err){
            const error = createHttpError(500, err.message);
            throw error;
        }
    }

    async findByRollNumber(rollNumber){
            const user = await User.findOne({ rollNumber });
            return user
       
    }

    async findById(id){
        return await User.findById(id);
    }

    async addGroupId(groupId, studentId){
        return await User.findByIdAndUpdate(studentId, 
            { $push: { groupsList: groupId} },
            { new: true }
        )
        
    }


}

export default new UserService();