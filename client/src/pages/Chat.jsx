import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://chatapp-cursor.onrender.com');

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (
        (msg.senderId === user?._id && msg.receiverId === selectedUser?._id) ||
        (msg.senderId === selectedUser?._id && msg.receiverId === user?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('receiveMessage');
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await API.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;
    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      messageText,
    };
    socket.emit('sendMessage', msg);
    setMessageText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with users */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-6 border-b bg-blue-600">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Simple Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {users.length === 0 && <div className="text-gray-400 text-center mt-8">No other users</div>}
          {users.map((u) => (
            <div
              key={u._id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-colors ${selectedUser?._id === u._id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow">
                {getInitials(u.username)}
              </div>
              <span className="font-medium text-lg">{u.username}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-white">
          <button onClick={handleLogout} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg font-semibold transition shadow">Logout</button>
        </div>
      </div>
      {/* Main chat window */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 h-full justify-center">
          {/* Chat header */}
          <div className="rounded-t-2xl bg-blue-600 px-8 py-4 flex items-center gap-4 shadow">
            {selectedUser ? (
              <>
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                  {getInitials(selectedUser.username)}
                </div>
                <span className="text-xl font-semibold text-white">{selectedUser.username}</span>
              </>
            ) : (
              <span className="text-lg text-white">Select a user to start chatting</span>
            )}
          </div>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white shadow rounded-b-2xl" style={{ minHeight: 300 }}>
            {selectedUser && (
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user._id;
                  return (
                    <div
                      key={msg._id || Math.random()}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`relative max-w-[70%] p-3 rounded-2xl shadow text-base ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}`}>
                        <div className="whitespace-pre-line break-words">{msg.messageText}</div>
                        <div className="text-xs text-right mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {/* Message input */}
          {selectedUser && (
            <form onSubmit={handleSend} className="flex items-center gap-2 bg-white rounded-b-2xl px-6 py-4 shadow border-t relative">
              <input
                className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-gray-800 placeholder-gray-400 shadow"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition shadow">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 