import createHttpError from "http-errors";
import tokenService from "../services/tokenService.js";

const isAuthenticated = (req, res, next) => {

    if(!req.cookies || !req.cookies.accessToken){
        return next(createHttpError(401, "Access token is missing"));
    }

    const { accessToken } = req.cookies;

    try{
        const payload = tokenService.verifyAccessToken(accessToken);
        req.user = payload;
        next();
    } catch(err){
        return next(createHttpError(401, err.message))
    }
    
     
}

export default isAuthenticated;