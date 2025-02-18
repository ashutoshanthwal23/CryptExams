import express from "express";
import answerController from "../controllers/answerController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/key", answerController.submitKey)
router.post("/answer", upload.single("file"), answerController.submitAnswer)

export default router;