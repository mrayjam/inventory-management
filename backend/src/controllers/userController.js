import User from '../models/User.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};