import mongoose from "mongoose";
import User from "../models/User.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            console.log('Creating default admin...');
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@rahulsoftware.com',
                password: 'Admin@123',
                role: 'admin'
            });

            await adminUser.save();
            console.log('Default admin created successfully');
        }
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;