import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

/* =======================
   REGISTER
======================= */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing ⚠️",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email ❌",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ SAFE FILE HANDLING
    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );
      profilePhoto = cloudResponse.secure_url;
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
      },
    });

    return res.status(201).json({
      message: "Account created successfully 🎉",
      success: true,
    });
  } catch (error) {
    console.error("REGISTER ERROR 🔥", error);
    return res.status(500).json({
      message: "Internal server error ⚙️",
      success: false,
    });
  }
};

/* =======================
   LOGIN
======================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing ⚠️",
        success: false,
      });
    }

    // ✅ IMPORTANT: select password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password ❌",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password ❌",
        success: false,
      });
    }

    // ✅ Role validation (case-safe)
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with the current role 🚫",
        success: false,
      });
    }

    // ✅ JWT (must exist in Vercel env)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.password = undefined;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,      // REQUIRED on Vercel
        sameSite: "none",  // REQUIRED cross-domain
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back, ${user.fullname} 😊`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("LOGIN ERROR 🔥", error);
    return res.status(500).json({
      message: "Internal server error ⚙️",
      success: false,
    });
  }
};

/* =======================
   LOGOUT
======================= */
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      })
      .json({
        message: "Logged out successfully 👋",
        success: true,
      });
  } catch (error) {
    console.error("LOGOUT ERROR 🔥", error);
    return res.status(500).json({
      message: "Internal server error ⚙️",
      success: false,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Hide email & phone for logged-out users
    const token = req.cookies?.token;
    if (!token) {
      user.email = undefined;
      user.phoneNumber = undefined;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =======================
   UPDATE PROFILE
======================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found 🔍",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    // ✅ SAFE FILE HANDLING
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content
      );

      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    await user.save();
    user.password = undefined;

    return res.status(200).json({
      message: "Profile updated successfully ✨",
      user,
      success: true,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR 🔥", error);
    return res.status(500).json({
      message: "Internal server error ⚙️",
      success: false,
    });
  }
};
