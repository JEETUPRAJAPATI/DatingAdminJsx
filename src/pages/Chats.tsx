import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, Flag, Trash2, Send, Smile, Image as ImageIcon, MoreVertical, Phone, Video, Ban, X } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Card, CardContent } from '../components/ui/Card';
import { Filters } from '../components/ui/Filters';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image';
  imageUrl?: string;
}

interface ChatThread {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    lastSeen: string;
    isOnline: boolean;
  }[];
  lastMessage: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
}

const dummyChats: ChatThread[] = [
  {
    id: '1',
    participants: [
      {
        id: 'user1',
        name: 'Sarah Parker',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        lastSeen: '2024-03-10T10:30:00',
        isOnline: true,
      },
      {
        id: 'user2',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        lastSeen: '2024-03-10T10:25:00',
        isOnline: false,
      },
    ],
    lastMessage: {
      id: 'm1',
      senderId: 'user1',
      senderName: 'Sarah Parker',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      message: 'Hey, how are you?',
      timestamp: '2024-03-10T10:30:00',
      status: 'read',
      type: 'text',
    },
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: '2',
    participants: [
      {
        id: 'user3',
        name: 'Emily Brown',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
        lastSeen: '2024-03-10T09:45:00',
        isOnline: true,
      },
      {
        id: 'user4',
        name: 'Michael Wilson',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
        lastSeen: '2024-03-10T09:40:00',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm2',
      senderId: 'user4',
      senderName: 'Michael Wilson',
      senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
      message: 'Check out this photo!',
      timestamp: '2024-03-10T09:45:00',
      status: 'delivered',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600&h=400&fit=crop',
    },
    unreadCount: 0,
    isPinned: false,
  },
];

const dummyMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    senderName: 'Sarah Parker',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    message: 'Hey, how are you?',
    timestamp: '2024-03-10T10:30:00',
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg2',
    senderId: 'user2',
    senderName: 'John Smith',
    senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    message: 'I\'m good, thanks! How about you?',
    timestamp: '2024-03-10T10:31:00',
    status: 'read',
    type: 'text',
  },
  {
    id: 'msg3',
    senderId: 'user1',
    senderName: 'Sarah Parker',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    message: 'Look at this amazing view!',
    timestamp: '2024-03-10T10:32:00',
    status: 'read',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600&h=400&fit=crop',
  },
];

export function Chats() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredChats = dummyChats.filter(chat =>
    chat.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: ChatMessage = {
      id: `msg${messages.length + 1}`,
      senderId: 'admin',
      senderName: 'Admin',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      message: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col lg:flex-row lg:space-x-6">
      {/* Chat List */}
      <div className={`w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:w-1/3 ${
        showMobileChat ? 'hidden lg:block' : 'block'
      }`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <Filters
            searchPlaceholder="Search chats..."
            searchValue={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>

        <div className="h-full overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              className={`w-full border-b border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => {
                setSelectedChat(chat);
                setShowMobileChat(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.participants[0].avatar}
                      alt={chat.participants[0].name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {chat.participants[0].isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{chat.participants[0].name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {chat.lastMessage.type === 'image' ? 'Sent an image' : chat.lastMessage.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
        !showMobileChat ? 'hidden lg:flex' : 'flex'
      }`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <button
                  className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={() => setShowMobileChat(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="relative">
                  <img
                    src={selectedChat.participants[0].avatar}
                    alt={selectedChat.participants[0].name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {selectedChat.participants[0].isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedChat.participants[0].name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.participants[0].isOnline ? 'Online' : 'Last seen ' + formatDate(selectedChat.participants[0].lastSeen)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Video className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Flag className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Ban className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[70%] items-end space-x-2 ${message.senderId === 'admin' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        {message.type === 'text' ? (
                          <div className={`rounded-lg px-4 py-2 ${
                            message.senderId === 'admin'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <p>{message.message}</p>
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-lg">
                            <img
                              src={message.imageUrl}
                              alt="Shared image"
                              className="max-w-sm rounded-lg"
                            />
                          </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}