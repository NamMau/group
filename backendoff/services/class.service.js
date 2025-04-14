// services/class.service.js
const Class = require('../models/class.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

class ClassService {
  async createClass(classData, adminId) {
    try {
      // Check if `classData` is valid
      if (!classData.name || !classData.tutor) {
        throw new Error('Class name and tutor ID are required.');
      }
      
      const tutor = await User.findById(classData.tutor);
      if (!tutor) {
        throw new Error(`Tutor not found with ID: ${classData.tutor}`);
      }
  
      //check if class already exists
      if (classData.students && classData.students.length > 0) {
        const students = await User.find({ _id: { $in: classData.students } });
        const foundStudentIds = students.map((s) => s._id.toString());
  
        const invalidStudents = classData.students.filter(
          (id) => !foundStudentIds.includes(id)
        );
  
        if (invalidStudents.length > 0) {
          throw new Error(`Invalid student IDs: ${invalidStudents.join(', ')}`);
        }
      }
      //check if class course already exists
      if (classData.courses && classData.courses.length > 0) {
        const courses = await Course.find({ _id: { $in: classData.courses } });
        const foundCourseIds = courses.map((c) => c._id.toString());
  
        const invalidCourses = classData.courses.filter(
          (id) => !foundCourseIds.includes(id)
        );
  
        if (invalidCourses.length > 0) {
          throw new Error(`Invalid course IDs: ${invalidCourses.join(', ')}`);
        }
      }
  
      classData.createdBy = adminId;
  
      //create a new class
      const newClass = await Class.create(classData);
      return newClass;
    } catch (error) {
      console.error('Error creating class:', error.message);
      throw new Error(error.message);
    }
  }
  
  

  async getAllClasses(filter = {}) {
    const classes = await Class.find(filter)
      .populate('tutor', 'fullName email')
      .populate('students', 'fullName email')
      .populate('courses', 'name description')
      .populate('createdBy', 'fullName email'); 
    return classes;
  }

  async getClassById(classId) {
    const cls = await Class.findById(classId)
      .populate('tutor', 'fullName email')
      .populate('students', 'fullName email')
      .populate('courses', 'name description')
      .populate('createdBy', 'fullName email');
    if (!cls) {
      throw new Error('Class not found.');
    }
    return cls;
  }

  async updateClass(classId, updateData) {
    const cls = await Class.findByIdAndUpdate(classId, updateData, { new: true, runValidators: true });
    if (!cls) {
      throw new Error('Class not found.');
    }
    return cls;
  }

  async deleteClass(classId) {
    const cls = await Class.findByIdAndDelete(classId);
    if (!cls) {
      throw new Error('Class not found.');
    }
    return { message: 'Class deleted successfully.' };
  }

  async deleteAllClasses(){
    await Class.deleteMany({});
  };

  async addStudentToClass(classId, studentId) {
    const cls = await Class.findById(classId);
    if (!cls) {
      throw new Error('Class not found.');
    }
    //check if student exists
    if (cls.students.includes(studentId)) {
      throw new Error('Student is already enrolled in this class.');
    }
    cls.students.push(studentId);
    await cls.save();
    return cls;
  }

  async removeStudentFromClass(classId, studentId) {
    const cls = await Class.findById(classId);
    if (!cls) {
      throw new Error('Class not found.');
    }
    if (!cls.students.includes(studentId)) {
      throw new Error('Student is not enrolled in this class.');
    }
    cls.students = cls.students.filter(id => id.toString() !== studentId.toString());
    await cls.save();
    return cls;
  }


  async getClassesByCourse(courseId) {
    const classes = await Class.find({ courses: courseId })
      .populate('tutor', 'fullName email')
      .populate('students', 'fullName email')
      .populate('courses', 'name description')
      .populate('createdBy', 'fullName email');
    return classes;
  }

  async getClassesByTutor(tutorId) {
    const classes = await Class.find({ tutor: tutorId })
      .populate('students', 'fullName email')
      .populate('courses', 'name description')
      .populate('createdBy', 'fullName email');
    return classes;
  }

  async searchClassByClassName(className) {
    try {
      //Find class by name
      const classes = await Class.find({
        name: { $regex: className, $options: 'i' } 
      });
      return classes;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = new ClassService();
