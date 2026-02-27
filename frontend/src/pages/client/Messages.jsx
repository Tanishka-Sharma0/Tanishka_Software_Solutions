import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ClientLayout from '../../components/Layouts/ClientLayout';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

const ClientMessages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => { fetchConversations(); }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/conversations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setConversations(data);
        } catch (error) { toast.error('Error fetching conversations'); }
    };

    const fetchMessages = async (userId) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessages(data);
        } catch (error) { toast.error('Error fetching messages'); }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, {
                receiverId: selectedUser._id,
                content: newMessage
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setNewMessage('');
            fetchMessages(selectedUser._id);
        } catch (error) { toast.error('Error sending message'); }
    };

    return (
        <ClientLayout>
            <div className="p-6 h-full">
                <h1 className="text-3xl font-bold mb-6">Messages</h1>
                <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow">
                    <div className="w-1/3 border-r">
                        <div className="p-4 font-bold border-b">Conversations</div>
                        <div className="overflow-y-auto h-full">
                            {conversations.map((conv) => (
                                <div key={conv._id}
                                    onClick={() => { setSelectedUser(conv); fetchMessages(conv._id); }}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?._id === conv._id ? 'bg-blue-50' : ''}`}>
                                    <p className="font-medium">{conv.name}</p>
                                    <p className="text-sm text-gray-500">{conv.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-2/3 flex flex-col">
                        {selectedUser ? (
                            <>
                                <div className="p-4 border-b font-bold">{selectedUser.name}</div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs p-3 rounded-lg ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                                                <p>{msg.content}</p>
                                                <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t flex">
                                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 p-2 border rounded-l-lg" placeholder="Type a message..." />
                                    <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r-lg">
                                        <FiSend />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Select a conversation</div>
                        )}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
};

export default ClientMessages;