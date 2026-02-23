import ServiceRequest from "../models/ServiceRequest.js";
import Project from "../models/Project.js";

const getRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'client') {
            query.client = req.user._id;
        }
        const requests = await ServiceRequest.find(query)
            .populate('client', 'name companyName')
            .populate('service', 'name')
            .populate('project');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createRequest = async (req, res) => {
    try {
        const { service, description } = req.body;
        const request = await ServiceRequest.create({
            client: req.user._id,
            service,
            description,
            status: 'pending',
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const approveRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        request.status = 'approved';
        await request.save();

        // Creating project from approved request
        const project = await Project.create({
            name: `${request.client.companyName}` - `${request.service.name}`,
            description: request.description,
            client: request.client._id,
            service: request.service._id,
            status: 'pending',
            createdBy: req.user._id,
        });
        request.project = project._id;
        await request.save();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getRequests, createRequest, approveRequest };