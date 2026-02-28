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
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        })
            .populate('sender', 'name role email')
            .populate('receiver', 'name role email')
            .sort('-createdAt');

        const usersMap = new Map();

        messages.forEach(msg => {
            const other = msg.sender._id.toString() === req.user._id.toString()
                ? msg.receiver
                : msg.sender;

            if (!usersMap.has(other._id.toString())) {
                usersMap.set(other._id.toString(), {
                    _id: other._id,
                    name: other.name,
                    role: other.role,
                    email: other.email || ''
                });
            }
        });

        const conversationUsers = Array.from(usersMap.values());
        res.json(conversationUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { sendMessage, getMessages, getConversations };