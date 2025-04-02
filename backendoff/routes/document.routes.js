const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authenticate, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all routes
router.use(authenticate);

// Document routes
router.post('/upload', upload.single('file'), authenticate, documentController.uploadDocument);
router.get('/get-documents', documentController.getDocuments);
router.get('/get-document/:documentId', documentController.getDocumentById);
router.put('/update-document/:documentId', isOwnerOrAdmin, documentController.updateDocument);
router.delete('/delete/:documentId',authenticate, isOwnerOrAdmin, documentController.deleteDocument);
router.get('/download:documentId/download', documentController.downloadDocument);
router.get('/search-document', documentController.searchDocuments);

module.exports = router;
