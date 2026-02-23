import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getUsers, createUser, deleteUser, updateProfile } from "../controllers/userController.js";
const router = express.Router();

router.route("/")
    .get(protect, authorize('admin'), getUsers)
    .post(protect, authorize('admin'), createUser);


router.delete("/:id", protect, authorize('admin'), deleteUser);
router.put("/profile", protect, updateProfile);



export default router;