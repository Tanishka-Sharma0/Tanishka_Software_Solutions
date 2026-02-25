import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getProjects, createProject, updateProjectStatus, assignEmployees, getProjectById } from "../controllers/projectController.js";
const router = express.Router();


router.route("/")
    .get(protect, getProjects)
    .post(protect, authorize("admin"), createProject);

router.get('/:id', protect, getProjectById);

router.put('/:id/status', protect, authorize('admin', 'employee'), updateProjectStatus);
router.put('/:id/assign', protect, authorize('admin'), assignEmployees);

export default router;