// controllers/class.controller.js
const classService = require('../services/class.service');

exports.createClass = async (req, res) => {
  try {
    const { courseId } = req.params; // Nếu không cần, có thể bỏ
    const adminId = req.user ? req.user._id : null; // Kiểm tra nếu có user

    if (!adminId) {
      return res.status(403).json({ message: 'Unauthorized: Missing admin ID.' });
    }

    const classData = req.body;

    // Kiểm tra xem classData có hợp lệ không
    if (!classData || !classData.name || !classData.startDate || !classData.endDate || !classData.quantity) {
      return res.status(400).json({ message: 'Missing required fields (name, startDate, endDate, quantity).' });
    }

    // Gọi service để tạo lớp học
    const newClass = await classService.createClass(classData, adminId);

    return res.status(201).json({
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return res.status(500).json({ message: error.message });
  }
};


exports.getAllClasses = async (req, res) => {
  try {
    const filter = req.query || {};
    const classes = await classService.getAllClasses(filter);
    res.status(200).json({
      success: true,
      message: 'Classes retrieved successfully',
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getClassById = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     const cls = await classService.getClassById(classId);
//     res.json(cls);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

exports.getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const cls = await classService.getClassById(classId);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ data: cls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const updatedClass = await classService.updateClass(classId, req.body);
    res.json({
      message: 'Class updated successfully',
      class: updatedClass,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const result = await classService.deleteClass(classId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


exports.deleteAllClasses = async (req, res) => {
  try {
    await classService.deleteAllClasses();
    res.status(200).json({ message: 'All classes have been deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classes', error: error.message });
  }
};

exports.addStudentToClass = async (req, res) => {
  try {
    const classId = req.params.classId.trim();
    const { studentId } = req.body;
    const updatedClass = await classService.addStudentToClass(classId, studentId);
    res.status(200).json({
      message: 'Student added to class successfully',
      class: updatedClass
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeStudentFromClass = async (req, res) => {
  try {
    const classId = req.paramsclassId.trim();
    const { studentId } = req.body;
    const updatedClass = await classService.removeStudentFromClass(classId, studentId);
    res.status(200).json({
      message: 'Student removed from class successfully',
      class: updatedClass
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClassesByCourse = async (req, res) => {
  try {
    const classes = await classService.getClassesByCourse(req.params.courseId);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassesByTutor = async (req, res) => {
  try {
    const classes = await classService.getClassesByTutor(req.params.tutorId);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.searchClassByClassName = async (req, res) => {
  try {
    const { className } = req.query;
    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }
    const classes = await classService.searchClassByClassName(className);
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
