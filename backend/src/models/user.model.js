import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: ["6", "Password must be of at least 6 characters long"],
            select: false,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, Number(process.env.SALTROUNDS));
};

const User = mongoose.model("User", userSchema);
export default User;
