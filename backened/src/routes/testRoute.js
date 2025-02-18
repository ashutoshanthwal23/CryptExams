import express from "express"
import isAuthenticated from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import testController from "../controllers/testController.js";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.single("file"), testController.uploadTest);
router.get("/teacher", isAuthenticated, testController.teacherAllTests);
router.get("/", isAuthenticated, testController.viewAllTest);
router.get("/:id", isAuthenticated, testController.viewTest);
router.get("/:id/student", isAuthenticated, testController.studentViewTest);
router.get("/result/:id", isAuthenticated, testController.testResult);
router.post("/:testId/send-message", isAuthenticated, testController.sendMessageToStudents);

export default router;