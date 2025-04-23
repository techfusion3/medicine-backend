const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// 👤 Register
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit');
  console.log(req.body); 
  const { name, email, password } = req.body;
    console.log('📝 New Registration:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id, email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ token, user: { id: savedUser._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '2h' });


    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
