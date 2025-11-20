import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(process.env.MONGO_LINK!);
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("DB Connection Error:", error);
    }
}