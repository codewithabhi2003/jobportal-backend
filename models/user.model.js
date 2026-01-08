import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  role: {
    type: String,
    enum: ["job-seeker", "Recruiter"],
  },

  // ✅ ADD THIS
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],

  profile: {
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    resume: String,
    resumeOriginalName: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    profilePhoto: String,
  },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
