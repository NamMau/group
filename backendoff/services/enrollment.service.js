const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const { sendEmail } = require('./email.service');

class EnrollmentService {
    async enrollStudent(studentId, courseId) {
        // Check if student is already enrolled
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            throw new Error('Student is already enrolled in this course.');
        }

        // Check if course exists and has capacity
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error('Course not found.');
        }

        const currentEnrollments = await Enrollment.countDocuments({ courseId });
        if (currentEnrollments >= course.maxStudents) {
            throw new Error('Course has reached maximum capacity.');
        }

        // Create enrollment
        const enrollment = new Enrollment({
            studentId,
            courseId,
            enrollmentDate: new Date(),
            status: 'active'
        });
        await enrollment.save();

        // Send confirmation email
        await sendEmail({
            to: studentId.email,
            subject: 'Course Enrollment Confirmation',
            text: `You have been successfully enrolled in ${course.name}.`
        });

        return enrollment;
    }

    async getStudentEnrollments(studentId) {
        return await Enrollment.find({ studentId })
            .populate('courseId', 'name description startDate endDate')
            .sort({ enrollmentDate: -1 });
    }

    async getCourseEnrollments(courseId) {
        return await Enrollment.find({ courseId })
            .populate('studentId', 'fullName email')
            .sort({ enrollmentDate: -1 });
    }

    async updateEnrollmentStatus(enrollmentId, status) {
        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { status },
            { new: true }
        );
        if (!enrollment) {
            throw new Error('Enrollment not found.');
        }
        return enrollment;
    }
}

module.exports = new EnrollmentService(); 