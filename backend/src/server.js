import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDb } from "./lib/db.js";

const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`App is listening to port: ${port}`);
        });
    } catch (error) {
        console.log(`Error in starting the server: ${error}`);
    }
};

startServer();
