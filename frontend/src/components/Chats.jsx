import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Chats = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    // Mock chat data
    const chatList = [
        {
            id: 1,
            name: 'Amir Kumar',
            orderId: '#ORD-1024',
            lastMessage: 'Urgent',
            time: 'Take Over',
            isUrgent: true,
            unread: true,
            messages: [
                { sender: 'customer', message: 'Hi, I placed order #ORD-1024 but haven\'t received any update.', time: '01.55pm' },
                { sender: 'support', message: 'Hello Amir! Your order #ORD-1024 is currently being processed. Expected delivery: May 9, 2026.', time: '01.56pm' },
                { sender: 'customer', message: 'Can I change the delivery address?', time: '01.57pm' },
                { sender: 'customer', message: 'Actually never mind, same address is fine. Thanks!', time: '01.58pm' },
            ]
        },
        {
            id: 2,
            name: 'Sofa Martinez',
            orderId: '#ORD-1023',
            lastMessage: 'Can I change my delivery address?',
            time: '5m',
            isUrgent: false,
            unread: true,
            messages: [
                { sender: 'customer', message: 'Can I change my delivery address for order #ORD-1023?', time: '02.10pm' },
                { sender: 'support', message: 'Yes, you can update your delivery address. Please provide the new address.', time: '02.12pm' },
                { sender: 'customer', message: 'I\'ll keep the same address for now. Thanks!', time: '02.15pm' },
            ]
        },
        {
            id: 3,
            name: 'Liam Johnson',
            orderId: '#ORD-1024',
            lastMessage: 'What is the return policy?',
            time: '10m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'What is the return policy for electronics?', time: '02.30pm' },
                { sender: 'support', message: 'We offer 30-day return policy for all electronics items.', time: '02.32pm' },
            ]
        },
        {
            id: 4,
            name: 'Emma Davis',
            orderId: '#ORD-1025',
            lastMessage: 'How can I track my shipment?',
            time: '15m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'How can I track my shipment for order #ORD-1025?', time: '02.45pm' },
                { sender: 'support', message: 'You can track your shipment using the tracking link sent to your email.', time: '02.47pm' },
            ]
        },
        {
            id: 5,
            name: 'Noah Brown',
            orderId: '#ORD-1026',
            lastMessage: 'Why was my order canceled?',
            time: '20m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'Why was my order #ORD-1026 canceled?', time: '03.00pm' },
                { sender: 'support', message: 'Your order was canceled due to payment verification issues.', time: '03.02pm' },
            ]
        },
        {
            id: 6,
            name: 'Olivia Wilson',
            orderId: '#ORD-1027',
            lastMessage: 'Where is my invoice?',
            time: '25m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'Where can I find my invoice for order #ORD-1027?', time: '03.15pm' },
                { sender: 'support', message: 'You can download your invoice from the order details page.', time: '03.17pm' },
            ]
        },
        {
            id: 7,
            name: 'Sofa Martinez',
            orderId: '#ORD-1028',
            lastMessage: 'Can I change my delivery address?',
            time: '30m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'Can I change my delivery address for order #ORD-1028?', time: '03.30pm' },
                { sender: 'support', message: 'Please provide your new address and we\'ll update it.', time: '03.32pm' },
            ]
        },
        {
            id: 8,
            name: 'Emma Davis',
            orderId: '#ORD-1029',
            lastMessage: 'How can I track my shipment?',
            time: '40m',
            isUrgent: false,
            unread: false,
            messages: [
                { sender: 'customer', message: 'I need help tracking my shipment for order #ORD-1029.', time: '03.45pm' },
                { sender: 'support', message: 'I\'ll help you track your shipment. Please wait a moment.', time: '03.47pm' },
            ]
        },
    ];

    // Filter chats based on search
    const filteredChats = chatList.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // In a real app, this would send the message to the server
            const newMessage = {
                sender: 'support',
                message: messageInput,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setSelectedChat({
                ...selectedChat,
                messages: [...selectedChat.messages, newMessage]
            });
            setMessageInput('');
        }
    };

    const handleTakeOver = () => {
        // In a real app, this would assign the chat to the current user
        alert('Taking over this chat...');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="chats" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
                        <p className="text-sm text-gray-500">Manage customer conversations</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order ID, Customer, Phone"
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Recent Chats ▼
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat List */}
                    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                        {/* Search in Chat List */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by order ID, Customer, Phone"
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Chat List Items */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredChats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChatSelect(chat)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">{chat.name}</span>
                                                <span className="text-xs text-gray-400">{chat.orderId}</span>
                                                {chat.isUrgent && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm truncate ${chat.unread ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end ml-2 flex-shrink-0">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
                                            {chat.unread && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredChats.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No chats found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat View */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                            {selectedChat.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">{selectedChat.name}</span>
                                                <span className="text-xs text-gray-400">{selectedChat.orderId}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">Online</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleTakeOver}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            Take Over
                                        </button>
                                        {selectedChat.isUrgent && (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-lg flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {selectedChat.messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[70%] ${msg.sender === 'customer'
                                                    ? 'bg-white border border-gray-200'
                                                    : 'bg-blue-600 text-white'
                                                } rounded-2xl px-4 py-2.5 shadow-sm`}>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-gray-400' : 'text-blue-200'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chat Input */}
                                <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800">Select a chat</h3>
                                    <p className="text-sm text-gray-500 mt-1">Choose a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chats;