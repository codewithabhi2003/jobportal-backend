import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { toggleBookmark, getSavedJobs } from "../controllers/bookmark.controller.js";

const router = express.Router();

router.post("/:jobId", isAuthenticated, toggleBookmark);
router.get("/get", isAuthenticated, getBookmarks);

export default router;
