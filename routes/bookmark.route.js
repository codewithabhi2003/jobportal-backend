import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  toggleBookmark,
  getSavedJobs,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

/* SAVE / UNSAVE JOB */
router.post("/:jobId", isAuthenticated, toggleBookmark);

/* GET SAVED JOBS */
router.get("/get", isAuthenticated, getSavedJobs);

export default router;
