import mongoose from "mongoose";
import User from "../models/User.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');

        const adminExits = await User.findOne({ role: 'admin' });

        if (!adminExits) {
            await User.create({
                name: 'Admin User',
                email: 'admin@rahulsoftware.com',
                password: 'Admin@123',
                role: 'admin'
            });
            console.log('Default admin created');
        }

    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

export default connectDB;