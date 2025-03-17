const Document = require('../models/document.model');
const { createNotification } = require('../services/notification.service');
const documentService = require('../services/document.service');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/documents/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    }
});

exports.uploadDocument = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            const document = await documentService.uploadDocument({
                ...req.body,
                uploadedBy: req.user._id
            }, {
                url: `/uploads/documents/${req.file.filename}`,
                type: req.file.mimetype,
                size: req.file.size
            });

            res.status(201).json(document);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

exports.getDocuments = async (req, res) => {
    try {
        const filters = {
            userId: req.user._id,
            isAdmin: req.user.role === 'admin',
            ...req.query
        };

        const documents = await documentService.getDocuments(filters);
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await documentService.getDocumentById(
            req.params.documentId,
            req.user._id
        );
        res.json(document);
    } catch (error) {
        if (error.message === 'Document not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Access denied.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const document = await documentService.updateDocument(
            req.params.documentId,
            req.body,
            req.user._id
        );
        res.json(document);
    } catch (error) {
        if (error.message === 'Document not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Unauthorized to update this document.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const result = await documentService.deleteDocument(
            req.params.documentId,
            req.user._id
        );
        res.json(result);
    } catch (error) {
        if (error.message === 'Document not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Unauthorized to delete this document.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.downloadDocument = async (req, res) => {
    try {
        const document = await documentService.getDocumentById(
            req.params.documentId,
            req.user._id
        );

        // Increment download count
        await documentService.incrementDownloadCount(req.params.documentId);

        // Send file
        res.download(document.fileUrl);
    } catch (error) {
        if (error.message === 'Document not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Access denied.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.searchDocuments = async (req, res) => {
    try {
        const documents = await documentService.searchDocuments(
            req.query.q,
            {
                userId: req.user._id,
                isAdmin: req.user.role === 'admin',
                ...req.query
            }
        );
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.commentOnDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    document.comments.push({
      commenter: req.user.userId,
      text,
    });
    await document.save();

    // Notify document owner
    await createNotification(document.owner, 'Your document has a new comment.');

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
