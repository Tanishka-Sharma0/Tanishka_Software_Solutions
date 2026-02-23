import Project from "../models/Project.js";
import User from "../models/User.js";

const getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'client') {
            query.client = req.user._id;
        } else if (req.user.role === 'employee') {
            query.assignEmployees = req.user._id;
        }


        const projects = await Project.find(query)
            .populate('client', 'name companyName')
            .populate('service', 'name')
            .populate('assignEmployees', 'name email')
            .populate('createdBy', 'name');
        res.json(projects);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createProject = async (req, res) => {
    try {

        const { name, description, client, service, startDate, deadline } = req.body;

        const project = await Project.create({
            name,
            description,
            client,
            service,
            startDate,
            deadline,
            createdBy: req.user._id
        });

        res.status(201).json(project);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const project = await project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        project.status = status;
        await project.save();

        res.json(project);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const assignEmployees = async (req, res) => {
    try {
        const { employeeIds } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.assignedEmployees = employeeIds;
        await project.save();

        res.json(project);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { getProjects, createProject, updateProjectStatus, assignEmployees };