import Message from '../models/Message.js';

const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content: content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const message = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        })
            .populate('sender', 'name role')
            .populate('receiver', 'name role')
            .sort('createdAt');
        res.json(message);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getConversations = async (req, res) => {
    try {
        const message = await Message.find({
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        })
            .populate('sender', 'name role')
            .populate('receiver', 'name role')
            .sort('-createdAt');

        // Get unique users from messages
        const users = new Map();
        message.forEach(msg => {
            if (msg.sender._id.toString() !== req.user._id.toString()) {
                users.set(msg.sender._id.toString(), msg.sender);
            }
            if (msg.receiver._id.toString() !== req.user._id.toString()) {
                users.set(msg.receiver._id.toString(), msg.receiver);
            }
        });
        res.json(Array.from(users.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { sendMessage, getMessages, getConversations };