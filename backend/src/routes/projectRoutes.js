import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getProjects, createProject, updateProjectStatus, assignEmployees } from "../controllers/projectController.js";
const router = express.Router();


router.route("/")
    .get(protect, getProjects)
    .post(protect, authorize("admin"), createProject);

router.put('/:id/status', protect, authorize('admin', 'employee'), updateProjectStatus);
router.put('/:id/assign', protect, authorize('admin'), assignEmployees);

export default router;