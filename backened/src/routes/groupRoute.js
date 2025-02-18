import express from "express"
import groupsController from "../controllers/groupsController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, groupsController.create);
router.get("/enrolled", isAuthenticated, groupsController.getStudentGroups);
router.get("/", isAuthenticated, groupsController.getAllGroups);
router.get("/:id", isAuthenticated, groupsController.getGroup);
router.post("/:id/student", isAuthenticated, groupsController.addStudent);
router.post("/:groupId/student/:studentId", isAuthenticated, groupsController.removeStudent);

export default router;