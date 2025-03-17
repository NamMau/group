const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, phoneNumber, studentId, department, personalTutor } = req.body;

    const additionalData = {
      phoneNumber,
      studentId,
      department,
      personalTutor
    };

    const result = await authService.register(fullName, email, password, role, additionalData);
    
    // Update additional user information if provided
    if (phoneNumber || department) {
      await authService.updateProfile(result.user.id, { phoneNumber, department });
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
        phoneNumber,
        department
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    if (error.message === 'Email already registered.') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deviceInfo = req.headers['user-agent'];
    const result = await authService.login(email, password, deviceInfo);
    res.json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    if (error.message === 'User not found or inactive.') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Invalid credentials.') {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required.' });
    }

    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    if (error.message === 'User not found.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    if (error.message === 'Invalid or expired token.') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await authService.logout(req.user._id, refreshToken);
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    await authService.logoutAll(req.user._id);
    res.json({ message: 'Logged out from all devices successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user._id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await authService.updateProfile(req.user._id, req.body);
    res.json(profile);
  } catch (error) {
    if (error.message === 'User not found.') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    if (error.message === 'Current password is incorrect.') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const preferences = await authService.updateNotificationPreferences(req.user._id, req.body);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerStudent = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, studentId, personalTutor } = req.body;

        const additionalData = {
            phoneNumber,
            studentId,
            personalTutor,
            role: 'student'
        };

        const result = await authService.register(fullName, email, password, 'student', additionalData);
        
        res.status(201).json({
            message: 'Student registered successfully',
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                email: result.user.email,
                role: result.user.role,
                phoneNumber: result.user.phoneNumber,
                studentId: result.user.studentId,
                personalTutor: result.user.personalTutor
            }
        });
    } catch (error) {
        if (error.message === 'Email already registered.') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

exports.registerTutor = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, department } = req.body;

        const additionalData = {
            phoneNumber,
            department,
            role: 'tutor'
        };

        const result = await authService.register(fullName, email, password, 'tutor', additionalData);
        
        res.status(201).json({
            message: 'Tutor registered successfully',
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                email: result.user.email,
                role: result.user.role,
                phoneNumber: result.user.phoneNumber,
                department: result.user.department
            }
        });
    } catch (error) {
        if (error.message === 'Email already registered.') {
            res.status(409).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};
