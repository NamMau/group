const courseService = require('../services/course.service');

// Course management
exports.createCourse = async (req, res) => {
    try {
        const course = await courseService.createCourse(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        const courses = await courseService.getCourses({ category, level, search });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await courseService.updateCourse(courseId, req.body);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        await courseService.deleteCourse(courseId);
        res.json({ message: 'Course deleted successfully.' });
    } catch (error) {
        if (error.message === 'Course not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Course enrollment
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req.body;
        const enrollment = await courseService.enrollInCourse(courseId, userId);
        if (!enrollment) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.status(201).json(enrollment);
    } catch (error) {
        if (error.message === 'User is already enrolled in this course.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.unenrollFromCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req.body;
        await courseService.unenrollFromCourse(courseId, userId);
        res.json({ message: 'Successfully unenrolled from course.' });
    } catch (error) {
        if (error.message === 'User is not enrolled in this course.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getEnrolledStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const students = await courseService.getEnrolledStudents(courseId);
        if (!students) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Course content
exports.addContent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const content = await courseService.addContent(courseId, req.body);
        if (!content) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { courseId, contentId } = req.params;
        const content = await courseService.updateContent(courseId, contentId, req.body);
        if (!content) {
            return res.status(404).json({ message: 'Content not found.' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { courseId, contentId } = req.params;
        await courseService.deleteContent(courseId, contentId);
        res.json({ message: 'Content deleted successfully.' });
    } catch (error) {
        if (error.message === 'Content not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Course progress
exports.updateProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId, contentId, completed } = req.body;
        const progress = await courseService.updateProgress(courseId, userId, contentId, completed);
        if (!progress) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { userId } = req.query;
        const progress = await courseService.getProgress(courseId, userId);
        if (!progress) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Class management
exports.createClass = async (req, res) => {
    try {
        const classObj = await courseService.createClass(req.body);
        res.status(201).json(classObj);
    } catch (error) {
        if (error.message === 'Time slot conflicts with existing class.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getClassesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const classes = await courseService.getClassesByCourse(courseId);
        if (!classes) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const classObj = await courseService.updateClass(classId, req.body);
        if (!classObj) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        res.json(classObj);
    } catch (error) {
        if (error.message === 'Class not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getClassById = async (req, res) => {
    try {
        const { courseId, classId } = req.params;
        const classObj = await courseService.getClassById(courseId, classId);
        if (!classObj) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        res.json(classObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { courseId, classId } = req.params;
        await courseService.deleteClass(courseId, classId);
        res.json({ message: 'Class deleted successfully.' });
    } catch (error) {
        if (error.message === 'Class not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getCourseEnrollments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const enrollments = await courseService.getCourseEnrollments(courseId);
        if (!enrollments) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Dashboard
exports.getStudentDashboard = async (req, res) => {
    try {
        const { studentId } = req.params;
        const dashboard = await courseService.getStudentDashboard(studentId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTutorDashboard = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const dashboard = await courseService.getTutorDashboard(tutorId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Tutor not found.' });
        }
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
