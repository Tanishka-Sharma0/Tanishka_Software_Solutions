import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EmployeeLayout from '../../components/Layouts/EmployeeLayout';
import toast from 'react-hot-toast';
import { FiSend, FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '../../utils/constants';

const EmployeeMessages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showUserList, setShowUserList] = useState(false);
    const [availableContacts, setAvailableContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConversations();
        fetchAvailableContacts();
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setConversations(data || []);
        } catch (error) {
            toast.error('Error fetching conversations');
        }
    };

    const fetchAvailableContacts = async () => {
        setLoading(true);
        try {
            const projectsRes = await axios.get(`${API_BASE_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            console.log('Employee assigned projects:', projectsRes.data);

            const clientIds = new Set();
            projectsRes.data.forEach(project => {
                if (project.client?._id) {
                    clientIds.add(project.client._id);
                }
            });

            const usersRes = await axios.get(`${API_BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const admin = usersRes.data.find(u => u.role === 'admin');

            const assignedClients = usersRes.data.filter(u =>
                u.role === 'client' && clientIds.has(u._id)
            );

            console.log('Admin:', admin);
            console.log('Assigned clients:', assignedClients);

            const contacts = [];
            if (admin) contacts.push(admin);
            contacts.push(...assignedClients);

            setAvailableContacts(contacts || []);

        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Error fetching contacts');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessages(data || []);
        } catch (error) {
            toast.error('Error fetching messages');
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        try {
            await axios.post(`${API_BASE_URL}/api/messages`, {
                receiverId: selectedUser._id,
                content: newMessage
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setNewMessage('');
            fetchMessages(selectedUser._id);
            fetchConversations();
        } catch (error) {
            toast.error('Error sending message');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startNewChat = (contact) => {
        setSelectedUser(contact);
        fetchMessages(contact._id);
        setShowUserList(false);

        if (!conversations.find(c => c._id === contact._id)) {
            setConversations(prev => [contact, ...prev]);
        }
    };

    const getRoleDisplay = (role, userData) => {
        if (role === 'admin') return 'Administrator';
        if (role === 'client') return userData?.companyName || 'Client';
        return role;
    };

    return (
        <EmployeeLayout>
            <div className="p-6 h-full">
                <h1 className="text-3xl font-bold mb-6">Messages</h1>

                <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
                    <div className="w-1/3 border-r flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <span className="font-bold text-lg">Conversations</span>
                            <button
                                onClick={() => setShowUserList(true)}
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center"
                                title="New Message"
                                disabled={availableContacts.length === 0}
                            >
                                <FiPlus className="mr-1" size={16} />
                                New Message
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                                    <p className="text-center">No conversations yet</p>
                                    <p className="text-sm text-center mt-2">
                                        {availableContacts.length > 0
                                            ? 'Click "New Message" to start chatting'
                                            : 'You can only message admin and clients whose projects you are assigned to'}
                                    </p>
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv._id}
                                        onClick={() => { setSelectedUser(conv); fetchMessages(conv._id); }}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${selectedUser?._id === conv._id ? 'bg-green-50' : ''
                                            }`}
                                    >
                                        <p className="font-medium">{conv.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {getRoleDisplay(conv.role, conv)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="w-2/3 flex flex-col">
                        {selectedUser ? (
                            <>
                                <div className="p-4 border-b bg-gray-50">
                                    <p className="font-bold text-lg">{selectedUser.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {getRoleDisplay(selectedUser.role, selectedUser)}
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg._id}
                                                className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs p-3 rounded-lg ${msg.sender._id === user._id
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <p>{msg.content}</p>
                                                    <p className="text-xs mt-1 opacity-70">
                                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-4 border-t">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Type a message..."
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim()}
                                            className="bg-green-600 text-white px-6 rounded-r-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <FiSend size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="text-6xl mb-4">💬</div>
                                <p className="text-lg">Select a conversation</p>
                                <p className="text-sm mt-2 text-center max-w-sm">
                                    You can message admin and clients whose projects you are working on
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {showUserList && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96 max-w-md">
                            <h3 className="text-lg font-bold mb-4">Select Contact</h3>

                            <div className="max-h-96 overflow-y-auto mb-4">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                ) : availableContacts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-2">No contacts available</p>
                                        <p className="text-sm text-gray-400">
                                            You can only message:<br />
                                            • Admin<br />
                                            • Clients whose projects are assigned to you
                                        </p>
                                        <p className="text-xs text-gray-400 mt-4">
                                            Wait for admin to assign you to projects
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {availableContacts.map(contact => (
                                            <div
                                                key={contact._id}
                                                onClick={() => startNewChat(contact)}
                                                className="p-3 hover:bg-gray-50 cursor-pointer border rounded-lg transition"
                                            >
                                                <p className="font-medium">{contact.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {getRoleDisplay(contact.role, contact)}
                                                </p>
                                                <p className="text-xs text-gray-400">{contact.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowUserList(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </EmployeeLayout>
    );
};

export default EmployeeMessages;