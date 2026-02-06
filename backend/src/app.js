import express from "express";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/messages", messageRouter);

export default app;
