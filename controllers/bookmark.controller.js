import { User } from "../models/user.model.js";

export const toggleBookmark = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);

    const exists = user.savedJobs.includes(jobId);

    if (exists) {
      user.savedJobs.pull(jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    const updatedUser = await User.findById(userId).populate("savedJobs");

    res.status(200).json({
      success: true,
      savedJobs: updatedUser.savedJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("savedJobs");

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
