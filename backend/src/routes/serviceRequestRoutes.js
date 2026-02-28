import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getRequests, createRequest, approveRequest, rejectRequest } from "../controllers/serviceRequestController.js";


const router = express.Router();

router.route('/')
    .get(protect, getRequests)
    .post(protect, authorize('client'), createRequest);

router.put("/:id/approve", protect, authorize('admin'), approveRequest);
router.put('/:id/reject', authorize('admin'), rejectRequest);

export default router;