// services/course.service.js
const Course = require('../models/course.model');
const Class = require('../models/class.model');
const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');
const Message = require('../models/message.model');

class CourseService {
    async getCoursesForUser(userId) {
          try {
            const user = await User.findById(userId).populate("courses");
      
            if (!user) {
              throw new Error("User not found");
            }
      
            if (user.role === "student" || user.role === "tutor") {
              return user.courses;
            }
      
            throw new Error("User is not a student or tutor");
      
          } catch (error) {
            throw new Error(error.message);
          }
    }
  // Create new course
  async createCourse(courseData) {
    // Check if course with the same name already exists
    const existingCourse = await Course.findOne({ name: courseData.name });
    if (existingCourse) {
      throw new Error('Course with this name already exists.');
    }

    const course = new Course(courseData);
    await course.save();

    // Send email to tutor if assigned
    if (courseData.tutor) {
      const tutor = await User.findById(courseData.tutor);
      if (tutor) {
        const Notification = require('../models/notification.model');
        await Notification.create({
            user: tutor._id,
            message: `You have been assigned as the tutor for the course ${course.name}.`
        });
      }
    }

    return course;
  }

  // Get all courses
  async getCourses(filters = {}) {
    const query = {};

    if (filters.name) {
        query.name = filters.name;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.level) {
      query.level = filters.level;
    }
    if (filters.description) {
      query.description = filters.description;
    }
    if (filters.startDate) {
        query.startDate = filters.startDate;
    }
    if (filters.enDate) {
      query.enDate = filters.enDate;
    }
    if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' }; // Tìm kiếm theo tên
    }

    console.log("Query filters:", query); // Debug để xem query thực sự được gửi đi
    const courses= await Course.find(query)
      .populate('tutor', 'fullName email')
      .populate('students', 'fullName email')
      .sort({ createdAt: -1 });

    console.log("Course found", courses); // Debug để xem kết quả tìm kiếm
    return courses;
  }

  // get course by id
  async getCourseById(courseId) {
    const course = await Course.findById(courseId)
      .populate('tutor', 'fullName email')
      .populate('students', 'fullName email');
    if (!course) {
      throw new Error('Course not found.');
    }
    return course;
  }

  // update course
  async updateCourse(courseId, updateData) {
    const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    if (!course) {
      throw new Error('Course not found.');
    }
    // Send email notifications if tutor, schedule or materials are updated
    if (updateData.tutor || updateData.schedule || updateData.materials) {
      const notifications = [];
      if (updateData.tutor) {
        const tutor = await User.findById(updateData.tutor);
        if (tutor) {
          notifications.push(sendEmail({
            to: tutor.email,
            subject: 'Course Update',
            text: `Course ${course.name} has been updated.`
          }));
        }
      }
      if (course.students && course.students.length > 0) {
        for (const studentId of course.students) {
          const student = await User.findById(studentId);
          if (student) {
            notifications.push(sendEmail({
              to: student.email,
              subject: 'Course Update',
              text: `Course ${course.name} has been updated.`
            }));
          }
        }
      }
      await Promise.all(notifications);
    }
    return course;
  }

  // delete course
  async deleteCourse(courseId) {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }
    return { message: 'Course deleted successfully.' };
  }

  async getCourseByName(name){
    try {
      return await Course.findOne({ name });
    } catch (error) {
      throw new Error('Error fetching course by name');
    }
  };

  // enroll in course
  async enrollInCourse(courseId, userId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }
    if (course.students.includes(userId)) {
      throw new Error('User is already enrolled in this course.');
    }
    course.students.push(userId);
    await course.save();
    return course;
  }
  async bulkEnrollStudents(courseId, studentIds) {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: { $each: studentIds } }
    });
  
    return { message: 'Students enrolled successfully.' };
  }
  

  // Unenroll from course
  async unenrollFromCourse(courseId, userId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }
    if (!course.students.includes(userId)) {
      throw new Error('User is not enrolled in this course.');
    }
    course.students = course.students.filter(id => id.toString() !== userId.toString());
    await course.save();
    return course;
  }

  // Get enrolled students
  async getCourseEnrollments(courseId) {
    const course = await Course.findById(courseId).populate('students', 'fullName email');
    if (!course) {
      throw new Error('Course not found.');
    }
    return course.students;
  }

  async getStudentDashboard(studentId) {
    const student = await User.findById(studentId)
      .populate('personalTutor', 'fullName email');
    if (!student) {
      throw new Error('Student not found.');
    }

    //take all classes that student is enrolled in and startDate > now
    const upcomingClasses = await Class.find({
      students: studentId,
      startDate: { $gt: new Date() }
    }).sort({ startDate: 1 }).limit(5);

    //take all classes that student is enrolled in
    const enrolledClasses = await Class.find({
      students: studentId
    }).populate('course', 'name description startDate endDate tutor');

    //from enrolledClasses, get unique course ids
    const enrolledCourseIds = new Set();
    enrolledClasses.forEach(cls => {
      if (cls.course) {
        enrolledCourseIds.add(cls.course._id.toString());
      }
    });
    const enrolledCourses = await Course.find({
      _id: { $in: Array.from(enrolledCourseIds) }
    }).select('name description startDate endDate tutor');

    const recentMessages = await Message.find({
      $or: [
        { sender: studentId },
        { recipient: studentId }
      ]
    }).sort({ createdAt: -1 }).limit(5);

    return {
      student,
      upcomingClasses,
      enrolledClasses,
      enrolledCourses,
      recentMessages
    };
  }

  async getTutorDashboard(tutorId) {
    // Check if the tutor exists
    const tutor = await User.findById(tutorId)
      .populate('students', 'fullName email');
    if (!tutor) {
      throw new Error('Tutor not found.');
    }
  
    //take all classes that tutor is teaching and startDate > now
    const upcomingClasses = await Class.find({
      tutor: tutorId,
      startDate: { $gt: new Date() }
    }).sort({ startDate: 1 }).limit(5);
  
    //take recent messages of tutor
    const recentMessages = await Message.find({
      $or: [
        { sender: tutorId },
        { recipient: tutorId }
      ]
    }).sort({ createdAt: -1 }).limit(5);
  
    //take all courses that tutor is teaching
    const courses = await Course.find({ tutor: tutorId })
      .select('name description startDate endDate');
  
    return {
      tutor,
      students: tutor.students,
      upcomingClasses,
      recentMessages,
      courses
    };
  }
  
}

module.exports = new CourseService();
