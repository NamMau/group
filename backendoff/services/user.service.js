const User = require('../models/user.model');
const { sendEmail } = require('./email.service');
const bcrypt = require('bcrypt');
const StudySession = require('../models/studySession.model');

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
    
    async getAllTutors() {
        try {
          const tutors = await User.find({ role: 'tutor' }).select('_id fullName email department');
          return tutors;
        } catch (error) {
          throw new Error('Error fetching tutors: ' + error.message);
        }
    }

    async getAllStudents() {
        try {
            const students = await User.find({role: 'student'})
                .select('_id fullName email department phoneNumber avatar');
            return students;
        } catch (error) {
            throw new Error('Error fetching students: ' + error.message);
        }
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

    // Student dashboard services
    async getStudyTime(studentId, startDate) {
        const student = await User.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        // Get study time records from database
        // This is a placeholder - you'll need to implement the actual study time tracking
        const studyTimeData = await StudySession.find({
            studentId,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        return studyTimeData;
    }

    async getStudentProgress(studentId) {
        const student = await User.findById(studentId)
            .populate({
                path: 'enrolledCourses',
                populate: {
                    path: 'topics',
                    select: 'name progress'
                }
            });

        if (!student) {
            return null;
        }

        const progressData = [];
        
        // Calculate progress for each course's topics
        student.enrolledCourses.forEach(course => {
            course.topics.forEach(topic => {
                progressData.push({
                    topic: topic.name,
                    progress: topic.progress || 0
                });
            });
        });

        return progressData;
    }

    async getEnrolledCourses(studentId) {
        const student = await User.findById(studentId)
            .populate({
                path: 'enrolledCourses',
                select: '_id name description startDate endDate tutor',
                populate: {
                    path: 'tutor',
                    select: 'name'
                }
            });

        if (!student) {
            return null;
        }

        return student.enrolledCourses;
    }
}

module.exports = new UserService(); 