import Service from "../models/Service.js";

const getServices = async (req, res) => {
    try {
        const services = await Service.find().populate('createdBy', 'name')
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createService = async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;
        const service = await Service.create({
            name,
            description,
            price,
            duration,
            createdBy: req.user._id
        });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await service.deleteOne();
        res.json({ message: 'Service deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getServices, createService, deleteService };