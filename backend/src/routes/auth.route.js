import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { body } from "express-validator";
const router = express.Router();

router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("fullname")
            .isLength({ min: 3 })
            .withMessage("Fullname must be at least 3 characters long"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    signup,
);

export default router;
