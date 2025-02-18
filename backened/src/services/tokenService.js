import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import RefreshToken from "../models/refreshTokenModel.js";
import createHttpError from "http-errors";

class TokenService {
    createAccessToken(payload){
        const accessToken = jwt.sign(payload, config.acccessTokenSecret, {
            expiresIn: '1h'
        })
        return accessToken;
    }

    async storeRefreshToken(token, userId){
        try{
            await RefreshToken.create({ token, userId });
        } catch(err){
            throw createHttpError(500, err.message);
        }
    }

    async deleteRefreshToken(userId){
        try{
            await RefreshToken.deleteOne({userId});
        } catch(err){
            const error = createHttpError(500, err.message);
            throw error;
        }
    }

    async isTokenRevoked({userId}){
        try{
            const token = await RefreshToken.findOne({userId});
            if(token){
                return false;
            }
            return true;
        } catch(err){
            throw createHttpError(500, err.message);
        }
    }

    createRefreshToken(payload){
        const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
            expiresIn: '1y'
        })
        return refreshToken;
    }

    verifyAccessToken(token){
        return jwt.verify(token, config.acccessTokenSecret);
    }

    verifyRefreshToken(token){
        return jwt.verify(token, config.refreshTokenSecret)
    }
}

export default new TokenService();