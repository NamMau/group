const CourseService = require('../services/course.service');
const User = require('../models/user.model');
const courseService = require('../services/course.service');
const Course = require('../models/course.model');

// New controller function to get courses by tutor
exports.getCoursesByTutor = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    // Check if the tutor exists
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Find courses where the tutor is associated (assuming a 'tutor' field in the Course model)
    const courses = await Course.find({ tutor: tutorId }).populate('tutor');

    res.status(200).json({
      message: 'Courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    console.error('Error getting courses by tutor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Sửa tên hàm thành getUserCourses
    const courses = await courseService.getUserCourses(userId);

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Course management
exports.createCourse = async (req, res) => {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json({
        message: 'Course created successfully',
        course,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getCourses = async (req, res) => {
    try {
      const { name, category, level, description, startDate, enDate, search } = req.query;
      //filter properties
      const filter = { name, category, level, description, startDate, enDate, search};
      const courses = await courseService.getCourses(filter);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await courseService.getCourseById(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found.' });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await courseService.updateCourse(courseId, req.body);
      if (!course) return res.status(404).json({ message: 'Course not found.' });
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

  exports.getCourseByName = async (req, res) => {
    try {
      const { name } = req.params;
      const course = await CourseService.getCourseByName(name);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Course enrollment
// exports.enrollInCourse = async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         const { userId } = req.body;
//         const enrollment = await courseService.enrollInCourse(courseId, userId);
//         if (!enrollment) {
//             return res.status(404).json({ message: 'Course not found.' });
//         }
//         res.status(201).json(enrollment);
//     } catch (error) {
//         if (error.message === 'User is already enrolled in this course.') {
//             res.status(400).json({ message: error.message });
//         } else {
//             res.status(500).json({ message: error.message });
//         }
//     }
// };
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    // Log để kiểm tra giá trị đầu vào
    console.log('Enrolling user:', userId, 'in course:', courseId);
    
    const enrollment = await courseService.enrollInCourse(courseId, userId);
    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Enrollment error:', error);
    
    if (error.message === 'User is already enrolled in this course.') {
      return res.status(400).json({ message: error.message });
    } else if (error.message === 'Course not found.' || error.message === 'Invalid courseId or userId format') {
      return res.status(404).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

exports.bulkEnrollStudents = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { studentIds } = req.body;
  
      const result = await courseService.bulkEnrollStudents(courseId, studentIds);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
