import createHttpError from "http-errors";
import User from "../models/userModel.js";
import bcrypt from "bcrypt"

class AuthService {
    async create(credentials){
        const { name, mobile, email, password } = credentials;

        const options = {};
        options.name = name;
        options.mobile = mobile;
        options.email = email;

        if(credentials.role){
            options.role = credentials.role;
        }

        if(credentials.rollNumber){
            options.rollNumber = credentials.rollNumber;
        }

        const user = await User.findOne({ email })

        if(user){
            const err = createHttpError(400, "Email already exists");
            throw err;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        options.password = hashedPassword;

        try{
            const user = await User.create(options);
            return user;
            
        } catch(err){
            throw createHttpError(500, err.message);
        }
    }

    async self(userId){
        try{
            const user = await User.findById(userId);
            if(!user){
                throw createHttpError(404, "User not found");
            }
            return user;
        } catch(err){
            throw createHttpError(500, err.message)
        }
    }
}

export default new AuthService();