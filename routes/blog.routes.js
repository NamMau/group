const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { auth, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all routes
router.use(auth);

// Blog routes
router.post('/', upload.single('featuredImage'), blogController.createPost);
router.get('/', blogController.getPosts);
router.get('/:postId', blogController.getPostById);
router.put('/:postId', isOwnerOrAdmin, upload.single('featuredImage'), blogController.updatePost);
router.delete('/:postId', isOwnerOrAdmin, blogController.deletePost);
router.post('/:postId/comments', blogController.addComment);
router.post('/:postId/like', blogController.likePost);
router.post('/:postId/comments/:commentId/like', blogController.likeComment);
router.get('/search', blogController.searchPosts);

module.exports = router;
