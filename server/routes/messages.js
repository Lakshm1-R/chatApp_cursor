// Message routes for sending and fetching messages
const express = require('express');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, messageText } = req.body;
    const newMessage = new Message({ senderId: req.userId, receiverId, messageText, timestamp: new Date() });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages between current user and another user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.userId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 