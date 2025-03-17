const User = require('../models/user.model');
const { sendEmail } = require('./email.service');
const bcrypt = require('bcrypt');

class UserService {
    async getAllUsers() {
        return await User.find().select('-password');
    }

    async getUserById(userId) {
        return await User.findById(userId).select('-password');
    }

    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    }

    async assignTutorBulk(tutorId, studentIds) {
        await User.updateMany(
            { _id: { $in: studentIds }, role: 'student' },
            { $set: { personalTutor: tutorId } }
        );

        // Get tutor and students for email notification
        const tutor = await User.findById(tutorId);
        const students = await User.find({ _id: { $in: studentIds } });

        // Send email notifications
        await sendEmail({
            to: tutor.email,
            subject: 'New Student Assignments',
            text: `You have been assigned ${students.length} new students.`
        });

        for (const student of students) {
            await sendEmail({
                to: student.email,
                subject: 'Tutor Assignment',
                text: `You have been assigned to ${tutor.fullName} as your tutor.`
            });
        }

        return { message: 'Tutor assigned to students successfully.' };
    }

    async updateUser(userId, updateData) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

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

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        return { message: 'User deleted successfully' };
    }

    async getUsersByRole(role) {
        return await User.find({ role }).select('-password');
    }

    async updateUserStatus(userId, isActive) {
        return await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select('-password');
    }

    async searchUsers(query) {
        return await User.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { studentId: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');
    }
}

module.exports = new UserService(); 