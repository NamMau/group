const enrollmentService = require('../services/enrollment.service');

// Enrollment management
exports.createEnrollment = async (req, res) => {
    try {
        const enrollment = await enrollmentService.createEnrollment(req.body);
        res.status(201).json(enrollment);
    } catch (error) {
        if (error.message === 'User is already enrolled in this course.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getEnrollments = async (req, res) => {
    try {
        const { userId, courseId, status } = req.query;
        const enrollments = await enrollmentService.getEnrollments({ userId, courseId, status });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnrollmentById = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const enrollment = await enrollmentService.updateEnrollment(enrollmentId, req.body);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        await enrollmentService.deleteEnrollment(enrollmentId);
        res.json({ message: 'Enrollment deleted successfully.' });
    } catch (error) {
        if (error.message === 'Enrollment not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;
        const enrollment = await enrollmentService.updateEnrollmentStatus(enrollmentId, status);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnrollmentProgress = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const progress = await enrollmentService.getEnrollmentProgress(enrollmentId);
        if (!progress) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Course access
exports.getEnrolledCourse = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const course = await enrollmentService.getEnrolledCourse(enrollmentId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEnrolledClasses = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const classes = await enrollmentService.getEnrolledClasses(enrollmentId);
        if (!classes) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Payment management
exports.processPayment = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const payment = await enrollmentService.processPayment(enrollmentId, req.body);
        if (!payment) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const payments = await enrollmentService.getPaymentHistory(enrollmentId);
        if (!payments) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student performance
exports.getStudentPerformance = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const performance = await enrollmentService.getStudentPerformance(enrollmentId);
        if (!performance) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceRecord = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const attendance = await enrollmentService.getAttendanceRecord(enrollmentId);
        if (!attendance) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
