import express from "express"
import authController from "../controllers/authController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
import validateRefreshToken from "../middlewares/validateRefreshToken.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", isAuthenticated, authController.logout);
router.get("/self", isAuthenticated, authController.self)
router.post("/refresh", validateRefreshToken, authController.refresh);

export default router;