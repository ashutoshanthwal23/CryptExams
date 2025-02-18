import createHttpError from "http-errors";
import tokenService from "../services/tokenService.js";

const validateRefreshToken = async (req, res, next) => {
    if(!req.cookies || !req.cookies.refreshToken){
        const err = createHttpError(401, "Refresh token is missing");
        return next(err);
    }

    const { refreshToken } = req.cookies;

    try{
        const payload = tokenService.verifyRefreshToken(refreshToken);
        const isInvoked = await tokenService.isTokenRevoked({userId: payload.id});
        if(isInvoked){
            const err = createHttpError(401, "Refresh token has been revoked");
            return next(err);
        }

        req.user = payload;
        next();

    } catch(err){
        const error = createHttpError(401, err.message);
        return next(error);
    }
}

export default validateRefreshToken;