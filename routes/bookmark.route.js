import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { toggleBookmark, getSavedJobs } from "../controllers/bookmark.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getSavedJobs);
router.post("/:jobId", isAuthenticated, toggleBookmark);

export default router;
