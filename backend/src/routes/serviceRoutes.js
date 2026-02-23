import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getServices, createService, deleteService } from "../controllers/serviceController.js";
const router = express.Router();

router.route('/')
    .get(protect, getServices)
    .post(protect, authorize('admin'), createService);

router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;

