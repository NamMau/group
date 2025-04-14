const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const RefreshToken = require('../models/refreshToken.model');
const { sendEmail } = require('../utils/email');

class AuthService {
    generateTokens(userId, role) {
        const accessToken = jwt.sign(
            { userId, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { userId, role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        return { accessToken, refreshToken };
    }

    async register(fullName, email, password, role, additionalData = {}) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            fullName,
            email,
            password: hashedPassword,
            role,
            ...additionalData
        };

        const user = await User.create(userData);
        const { accessToken, refreshToken } = this.generateTokens(user._id, user.role);

        // Save refresh token
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            deviceInfo: 'Web Browser',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 7 days
        });

        return {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                studentId: user.studentId,
                department: user.department,
                personalTutor: user.personalTutor
            },
            accessToken,
            refreshToken
        };
    }

    async login(email, password, deviceInfo) {
        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            throw new Error('User not found or inactive.');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials.');
        }

        const { accessToken, refreshToken } = this.generateTokens(user._id, user.role);

        // Save refresh token
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            deviceInfo: deviceInfo || 'Web Browser',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 7 days
        });

        return {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            
            // Check if refresh token exists in database
            const storedToken = await RefreshToken.findOne({ token: refreshToken });
            if (!storedToken) {
                throw new Error('Invalid refresh token.');
            }

            // Check if refresh token is expired
            if (storedToken.expiresAt < new Date()) {
                await RefreshToken.findByIdAndDelete(storedToken._id);
                throw new Error('Refresh token has expired.');
            }

            // Generate new tokens
            const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(
                decoded.userId,
                decoded.role
            );

            // Update refresh token in database
            await RefreshToken.findByIdAndUpdate(storedToken._id, {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            return {
                accessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error('Invalid refresh token.');
        }
    }

    async logout(userId, refreshToken) {
        // Delete refresh token
        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
        }
        return true;
    }

    async logoutAll(userId) {
        // Delete all refresh tokens for the user
        await RefreshToken.deleteMany({ userId });
        return true;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found.');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        await Token.create({
            userId: user._id,
            token: resetToken,
            type: 'reset',
            expiresAt: resetTokenExpiry
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `To reset your password, click the following link: ${resetUrl}`
        });

        return true;
    }

    async resetPassword(token, password) {
        const resetToken = await Token.findOne({
            token,
            type: 'reset',
            expiresAt: { $gt: Date.now() }
        });

        if (!resetToken) {
            throw new Error('Invalid or expired token.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(resetToken.userId, {
            password: hashedPassword
        });

        await Token.findByIdAndDelete(resetToken._id);

        return true;
    }

    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    }

    async updateProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found.');
        }

        return user;
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return true;
    }

    async updateNotificationPreferences(userId, preferences) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { notificationPreferences: preferences } },
            { new: true }
        ).select('-password');

        if (!user) {
            throw new Error('User not found.');
        }

        return user.notificationPreferences;
    }
}

module.exports = new AuthService(); 