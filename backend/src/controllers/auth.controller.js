import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

export const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, fullname, password } = req.body;

        const userAlready = await User.findOne({ email });
        if (userAlready) {
            return res.status(409).json({ message: "User already exists" });
        }

        if (!email || !password || !fullname) {
            return res.status(400).json({ message: `All fields are required` });
        }

        const hashedPassword = await User.hashPassword(password);

        const newUser = new User({
            email,
            fullname,
            password: hashedPassword,
        });
        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: `Invalid user data` });
        }
    } catch (error) {
        console.log(`Error in Auth Controller: ${error}`);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const isUser = await User.findOne({ email }).select("+password");
        if (!isUser) {
            return res
                .status(400)
                .json({ message: `Invalid email or password` });
        }
        const isValidPassword = await isUser.comparePassword(password);
        if (!isValidPassword) {
            return res
                .status(400)
                .json({ message: `Invalid email or password` });
        }
        generateToken(isUser._id, res);
        res.status(200).json({
            _id: isUser._id,
            fullname: isUser.fullname,
            profilePic: isUser.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller: " + error.message);
        res.status(500).json({ message: `Internal server error` });
    }
};

export const logout = (_req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: `Internal server error` });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findById(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true },
        );
        res.status(200).json({ updatedUser });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: `Internal server error` });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: `Internal server error` });
    }
};
