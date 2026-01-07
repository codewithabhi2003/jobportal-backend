
import Company from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required. ⚠️",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company. ❌",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        return res.status(201).json({
            message: "Company registered successfully. 🎉",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(400).json({
                message: "Companies not found. 🔍",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const CompanyId = req.params.id;
        const company = await Company.findById(CompanyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found. ❌",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body; // Fix: Extract required fields from req.body

        const file = req.file;
        let logo;
        if (file) { // Fix: Ensure file processing only happens if a file is provided
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo; // Fix: Update logo only if a new file is uploaded

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(400).json({
                message: "Company not found. ❌",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information updated. ✅",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};


