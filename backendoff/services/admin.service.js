const User = require('../models/user.model');
const Course = require('../models/course.model');
const Class = require('../models/class.model');
const { sendEmail } = require('./email.service');
const Message = require('../models/message.model');
const mongoose = require('mongoose');

class AdminService {
    async getAllUsers() {
        return await User.find().select('-password');
    }

    async getDashboardStats() {
        try {
            const [messageStats, exceptionStats] = await Promise.all([
                this.getMessageStatistics(),
                this.getExceptionReports()
            ]);

            return {
                messageStats: {
                    last7Days: messageStats.last7Days.map(day => day.count),
                    averagePerTutor: messageStats.averagePerTutor
                },
                exceptionStats: {
                    studentsWithoutTutor: exceptionStats.studentsWithoutTutor.length,
                    inactiveStudents: {
                        sevenDays: exceptionStats.inactiveStudents.sevenDays.length,
                        twentyEightDays: exceptionStats.inactiveStudents.twentyEightDays.length
                    }
                }
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    }

    async assignTutorToStudent(studentId, tutorId) {
        const [student, tutor] = await Promise.all([
            User.findById(studentId),
            User.findById(tutorId)
        ]);

        if (!student || student.role !== 'student') {
            throw new Error('Student not found.');
        }

        if (!tutor || tutor.role !== 'tutor') {
            throw new Error('Tutor not found.');
        }

        // Update student's personal tutor
        student.personalTutor = tutorId;
        await student.save();

        // Add student to tutor's students list
        if (!tutor.students.includes(studentId)) {
            tutor.students.push(studentId);
            await tutor.save();
        }

        // Send notifications
        await this.notifyTutorAssignment(student, tutor);
        return { message: 'Tutor assigned successfully.' };
    }

    async bulkAssignTutors(assignments) {
        const results = [];
        const errors = [];

        for (const { studentId, tutorId } of assignments) {
            try {
                await this.assignTutorToStudent(studentId, tutorId);
                results.push({ studentId, tutorId, success: true });
            } catch (error) {
                errors.push({ studentId, tutorId, error: error.message });
            }
        }

        return {
            results,
            errors,
            total: assignments.length,
            successful: results.length,
            failed: errors.length
        };
    }

    async reassignTutor(studentId, newTutorId) {
        const [student, newTutor] = await Promise.all([
            User.findById(studentId),
            User.findById(newTutorId)
        ]);

        if (!student || student.role !== 'student') {
            throw new Error('Student not found.');
        }

        if (!newTutor || newTutor.role !== 'tutor') {
            throw new Error('New tutor not found.');
        }

        // Remove student from old tutor's list
        if (student.personalTutor) {
            const oldTutor = await User.findById(student.personalTutor);
            if (oldTutor) {
                oldTutor.students = oldTutor.students.filter(id => id.toString() !== studentId);
                await oldTutor.save();
            }
        }

        // Update student's personal tutor
        student.personalTutor = newTutorId;
        await student.save();

        // Add student to new tutor's list
        if (!newTutor.students.includes(studentId)) {
            newTutor.students.push(studentId);
            await newTutor.save();
        }

        // Send notifications
        await this.notifyTutorReassignment(student, newTutor);

        return { message: 'Tutor reassigned successfully.' };
    }

    async getUnassignedStudents() {
        return await User.find({
            role: 'student',
            personalTutor: { $exists: false }
        }).select('fullName email department studentId');
    }

    async getTutorWorkload() {
        const tutors = await User.find({ role: 'tutor' })
            .populate('students', 'fullName email department studentId');

        return tutors.map(tutor => ({
            tutorId: tutor._id,
            tutorName: tutor.fullName,
            studentCount: tutor.students.length,
            students: tutor.students
        }));
    }

    async updateSystemSettings(settings) {
        // Implement system settings update logic
        // This could include updating configuration files or database settings
        return { message: 'System settings updated successfully.' };
    }

    async generateReports(reportType, filters = {}) {
        switch (reportType) {
            case 'enrollment':
                return await this.generateEnrollmentReport(filters);
            case 'performance':
                return await this.generatePerformanceReport(filters);
            case 'attendance':
                return await this.generateAttendanceReport(filters);
            default:
                throw new Error('Invalid report type.');
        }
    }

    // Helper methods
    async notifyTutorAssignment(student, tutor) {
        // Notify student
        await sendEmail({
            to: student.email,
            subject: 'Tutor Assignment',
            text: `You have been assigned to ${tutor.fullName} as your personal tutor.`
        });

        // Notify tutor
        await sendEmail({
            to: tutor.email,
            subject: 'New Student Assignment',
            text: `You have been assigned ${student.fullName} as your student.`
        });
    }

    async notifyTutorReassignment(student, newTutor) {
        // Notify student
        await sendEmail({
            to: student.email,
            subject: 'Tutor Reassignment',
            text: `Your personal tutor has been changed to ${newTutor.fullName}.`
        });

        // Notify new tutor
        await sendEmail({
            to: newTutor.email,
            subject: 'New Student Assignment',
            text: `You have been assigned ${student.fullName} as your student.`
        });
    }

    async generateEnrollmentReport(filters) {
        // Implement enrollment report generation
        return {
            totalEnrollments: 0,
            enrollmentsByDepartment: {},
            enrollmentsByCourse: {},
            enrollmentsByTutor: {}
        };
    }

    async generatePerformanceReport(filters) {
        // Implement performance report generation
        return {
            averageGrades: {},
            completionRates: {},
            attendanceRates: {}
        };
    }

    async generateAttendanceReport(filters) {
        // Implement attendance report generation
        return {
            attendanceByClass: {},
            attendanceByStudent: {},
            attendanceByTutor: {}
        };
    }

    async getMessageStatistics() {
        try {
            // Get messages from last 7 days
            const last7Days = await Message.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            // Get average messages per tutor
            const tutors = await User.find({ role: 'tutor' });
            const averagePerTutor = await Promise.all(
                tutors.map(async (tutor) => {
                    const messageCount = await Message.countDocuments({
                        $or: [
                            { sender: tutor._id },
                            { recipient: tutor._id }
                        ]
                    });

                    return {
                        tutorName: tutor.fullName,
                        average: messageCount / 7 // Average per day
                    };
                })
            );

            return {
                last7Days: last7Days.map(day => ({
                    date: day._id,
                    count: day.count
                })),
                averagePerTutor
            };
        } catch (error) {
            console.error('Error in getMessageStatistics:', error);
            throw error;
        }
    }

    async getExceptionReports() {
        try {
            // Find students without tutors
            const studentsWithoutTutor = await User.find({
                role: 'student',
                personalTutor: { $exists: false }
            }).select('_id fullName');

            // Find inactive students (7 days)
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const inactiveSevenDays = await User.find({
                role: 'student',
                lastActivity: { $lt: sevenDaysAgo }
            }).select('_id fullName lastActivity');

            // Find inactive students (28 days)
            const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
            const inactiveTwentyEightDays = await User.find({
                role: 'student',
                lastActivity: { $lt: twentyEightDaysAgo }
            }).select('_id fullName lastActivity');

            return {
                studentsWithoutTutor,
                inactiveStudents: {
                    sevenDays: inactiveSevenDays,
                    twentyEightDays: inactiveTwentyEightDays
                }
            };
        } catch (error) {
            console.error('Error in getExceptionReports:', error);
            throw error;
        }
    }
}

module.exports = new AdminService(); 