const Document = require('../models/document.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = 'uploads/documents';
    try {
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
  
}).single('file');

// Upload document
exports.uploadDocument = async (req, res) => {
  upload(req, res, async function (err) {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: err.code === 'LIMIT_FILE_SIZE' 
            ? 'File size cannot exceed 5MB' 
            : `File upload error: ${err.message}` 
        });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get data from request
      const { studentId, courseId, name } = req.body;
      
      // Validate required fields
      if (!studentId || !courseId) {
        // Clean up uploaded file
        if (req.file.path) {
          await fs.unlink(req.file.path);
        }
        return res.status(400).json({ message: 'studentId and courseId are required.' });
      }

      // Validate course enrollment
      const course = await Course.findOne({ _id: courseId, students: studentId });
      if (!course) {
        // Clean up uploaded file
        if (req.file.path) {
          await fs.unlink(req.file.path);
        }
        return res.status(404).json({ message: 'Course not found or student not enrolled' });
      }

      // Create document record
      const document = new Document({
        name: name || req.file.originalname,
        courseId,
        studentId,
        filePath: req.file.path,
        fileUrl: `/uploads/documents/${req.file.filename}`,
        fileType: path.extname(req.file.originalname).toLowerCase().substring(1),
        fileSize: req.file.size,
        submissionDate: new Date(),
        status: 'submitted',
        uploadedBy: studentId
      });

      await document.save();

      // Return success response
      return res.status(201).json({
        message: 'Document uploaded successfully',
        data: {
          id: document._id,
          name: document.name,
          fileUrl: document.fileUrl,
          submissionDate: document.submissionDate,
          status: document.status,
          fileType: document.fileType,
          fileSize: document.fileSize
        }
      });

    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        await fs.unlink(req.file.path);
      }
      console.error('Error uploading document:', error);
      return res.status(500).json({ 
        message: 'Error uploading document', 
        error: error.message 
      });
    }
  });
};

// Get documents by student ID
exports.getStudentDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.query;

    const query = { studentId };
    if (courseId) {
      query.courseId = courseId;
    }

    const documents = await Document.find(query)
      .populate('courseId', 'name')
      .sort({ submissionDate: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents: ' + error.message });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('courseId', 'name')
      .populate('studentId', 'name');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document: ' + error.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the document belongs to the requesting student
    if (document.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    // Delete file from storage
    await fs.unlink(document.filePath);
    
    // Delete document from database
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document: ' + error.message });
  }
};

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('courseId', 'name')
      .populate('studentId', 'name')
      .sort({ submissionDate: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents: ' + error.message });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if file exists
    try {
      await fs.access(document.filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(document.filePath, document.name);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading document: ' + error.message });
  }
};

// Search documents
exports.searchDocuments = async (req, res) => {
  try {
    const { query, courseId, status } = req.query;
    const searchQuery = {};

    if (query) {
      searchQuery.name = { $regex: query, $options: 'i' };
    }

    if (courseId) {
      searchQuery.courseId = courseId;
    }

    if (status) {
      searchQuery.status = status;
    }

    const documents = await Document.find(searchQuery)
      .populate('courseId', 'name')
      .populate('studentId', 'name')
      .sort({ submissionDate: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error searching documents: ' + error.message });
  }
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name, status } = req.body;

    const document = await Document.findById(documentId);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update document fields
    if (name) document.name = name;
    if (status) document.status = status;

    await document.save();

    res.status(200).json({
      message: 'Document updated successfully',
      document: {
        id: document._id,
        name: document.name,
        status: document.status,
        submissionDate: document.submissionDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document: ' + error.message });
  }
};
