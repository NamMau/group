const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { auth, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all routes
router.use(auth);

// Document routes
router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:documentId', documentController.getDocumentById);
router.put('/:documentId', isOwnerOrAdmin, documentController.updateDocument);
router.delete('/:documentId', isOwnerOrAdmin, documentController.deleteDocument);
router.get('/:documentId/download', documentController.downloadDocument);
router.get('/search', documentController.searchDocuments);

module.exports = router;
