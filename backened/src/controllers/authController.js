import createHttpError from "http-errors";
import { UserDTO } from "../dto/userDto.js";
import authService from "../services/authService.js";
import credentialService from "../services/credentialService.js";
import tokenService from "../services/tokenService.js";
import userService from "../services/userService.js";

class AuthController {
    async register(req, res, next){
        try{
            const user = await authService.create(req.body);

            const payload = {
                id: user._id,
                role: user.role
            }

            const accessToken = tokenService.createAccessToken(payload);
            await tokenService.storeRefreshToken(accessToken, user._id);

            const refreshToken = tokenService.createRefreshToken(payload);

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })

            res.json({msg: "registered successfully", user: new UserDTO(user)})

        } catch(err){
            console.log(err);
            next(err);
            return;
        }
    }

    async login(req, res, next){
        const { email, password } = req.body;

        try{
            const user = await userService.findByEmail(email);

            await tokenService.deleteRefreshToken(user._id);

            const isMatch = await credentialService.comparePassword(password, user.password);
            if(!isMatch){
                const error = createHttpError(400, "Email or password do not match");
                return next(error);
            }

            const payload = {
                id: user._id,
                role: user.role
            }

            const accessToken = tokenService.createAccessToken(payload);
            await tokenService.storeRefreshToken(accessToken, user._id);

            const refreshToken = tokenService.createRefreshToken(payload);

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: "None",
                secure: true
            })

            res.json({msg: "logged in success", user: new UserDTO(user)});

        } catch(err){
            return next(err);
        }
    }

    async logout(req, res, next){
        try{
            await tokenService.deleteRefreshToken(req.user.id);

            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/'
            });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/'
            });

            res.json({});
        } catch(err){
            return next(err);
        }
    }

    async self(req, res, next){
        const userId = req.user.id;
        try{
            const user = await authService.self(userId);
            res.json({ user: new UserDTO(user)});
        } catch(err){
            return next(err)
        }
    }

    async refresh(req, res, next){
        try{
            const payload = {
                id: req.user.id,
                role: req.user.role
            }

            await tokenService.deleteRefreshToken(req.user.id);

            const accessToken = tokenService.createAccessToken(payload);

            await tokenService.storeRefreshToken(accessToken, req.user.id);

            const refreshToken = tokenService.createRefreshToken(payload);

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: "None",
                secure: true
            });

            res.json({});

        } catch(err){
            return next(err);
        }
    }
}

export default new AuthController();