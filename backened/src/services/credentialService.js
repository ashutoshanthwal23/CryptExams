import bcrypt from "bcrypt"
import createHttpError from "http-errors";

class CredentialService {
    async comparePassword(plainPassword, hashedPassword){
        try{
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch(err){
            throw createHttpError(500, err.message);
        }
    }
}

export default new CredentialService();