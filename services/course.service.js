const Course = require('../models/course.model');
const Class = require('../models/class.model');
const { sendEmail } = require('./email.service');
const User = require('../models/user.model');
const Message = require('../models/message.model');

class CourseService {
    async createCourse(courseData) {
        // Check for duplicate course name
        const existingCourse = await Course.findOne({ name: courseData.name });
        if (existingCourse) {
            throw new Error('Course with this name already exists.');
        }

        const course = new Course(courseData);
        await course.save();

        // Notify tutor if assigned
        if (courseData.tutor) {
            await sendEmail({
                to: courseData.tutor.email,
                subject: 'New Course Assignment',
                text: `You have been assigned as tutor for course: ${course.name}`
            });
        }

        return course;
    }

    async getCourses(filters = {}) {
        return await Course.find(filters)
            .populate('tutor', 'fullName email')
            .populate('students', 'fullName email')
            .sort({ createdAt: -1 });
    }

    async updateCourse(courseId, updateData) {
        const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        if (!course) {
            throw new Error('Course not found.');
        }

        // Notify students and tutor about changes
        if (updateData.tutor || updateData.schedule || updateData.materials) {
            const notifications = [];
            
            // Notify tutor if changed
            if (updateData.tutor) {
                notifications.push(sendEmail({
                    to: course.tutor.email,
                    subject: 'Course Update',
                    text: `Course ${course.name} has been updated.`
                }));
            }

            // Notify students
            for (const student of course.students) {
                notifications.push(sendEmail({
                    to: student.email,
                    subject: 'Course Update',
                    text: `Course ${course.name} has been updated.`
                }));
            }

            await Promise.all(notifications);
        }

        return course;
    }

    async createClass(classData) {
        // Check for scheduling conflicts
        const existingClass = await Class.findOne({
            course: classData.course,
            startTime: { $lt: classData.endTime },
            endTime: { $gt: classData.startTime }
        });

        if (existingClass) {
            throw new Error('Time slot conflicts with existing class.');
        }

        const classObj = new Class(classData);
        await classObj.save();

        // Notify students and tutor
        const course = await Course.findById(classData.course).populate('students tutor');
        const notifications = [];

        // Notify tutor
        notifications.push(sendEmail({
            to: course.tutor.email,
            subject: 'New Class Scheduled',
            text: `A new class has been scheduled for course: ${course.name}`
        }));

        // Notify students
        for (const student of course.students) {
            notifications.push(sendEmail({
                to: student.email,
                subject: 'New Class Scheduled',
                text: `A new class has been scheduled for course: ${course.name}`
            }));
        }

        await Promise.all(notifications);
        return classObj;
    }

    async getClassesByCourse(courseId) {
        return await Class.find({ course: courseId })
            .populate('tutor', 'fullName email')
            .sort({ startTime: 1 });
    }

    async updateClass(classId, updateData) {
        const classObj = await Class.findByIdAndUpdate(classId, updateData, { new: true });
        if (!classObj) {
            throw new Error('Class not found.');
        }

        // Notify about changes
        const course = await Course.findById(classObj.course).populate('students tutor');
        const notifications = [];

        notifications.push(sendEmail({
            to: course.tutor.email,
            subject: 'Class Update',
            text: `Class for course ${course.name} has been updated.`
        }));

        for (const student of course.students) {
            notifications.push(sendEmail({
                to: student.email,
                subject: 'Class Update',
                text: `Class for course ${course.name} has been updated.`
            }));
        }

        await Promise.all(notifications);
        return classObj;
    }

    async getStudentDashboard(studentId) {
        const student = await User.findById(studentId)
            .populate('personalTutor', 'fullName email')
            .populate({
                path: 'courses',
                populate: {
                    path: 'tutor',
                    select: 'fullName email'
                }
            });

        const upcomingClasses = await Class.find({
            course: { $in: student.courses.map(c => c._id) },
            startTime: { $gt: new Date() }
        }).sort({ startTime: 1 }).limit(5);

        const recentMessages = await Message.find({
            $or: [
                { sender: studentId },
                { recipient: studentId }
            ]
        }).sort({ createdAt: -1 }).limit(5);

        return {
            student,
            upcomingClasses,
            recentMessages,
            courses: student.courses
        };
    }

    async getTutorDashboard(tutorId) {
        const tutor = await User.findById(tutorId)
            .populate('students', 'fullName email');

        const upcomingClasses = await Class.find({
            tutor: tutorId,
            startTime: { $gt: new Date() }
        }).sort({ startTime: 1 }).limit(5);

        const recentMessages = await Message.find({
            $or: [
                { sender: tutorId },
                { recipient: tutorId }
            ]
        }).sort({ createdAt: -1 }).limit(5);

        return {
            tutor,
            students: tutor.students,
            upcomingClasses,
            recentMessages
        };
    }
}

module.exports = new CourseService(); 