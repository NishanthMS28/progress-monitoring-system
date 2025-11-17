const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, projectId } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role: role || 'customer', projectId });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      projectId: user.projectId,
      token: generateToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('projectId');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      projectId: user.projectId,
      token: generateToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate('projectId');
    return res.json(me);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).populate('projectId').select('-password');
    return res.json(customers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

