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
