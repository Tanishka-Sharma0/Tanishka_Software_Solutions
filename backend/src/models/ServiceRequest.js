import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

export default ServiceRequest;