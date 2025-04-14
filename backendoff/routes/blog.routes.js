const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate } = require('../middlewares/auth');

// Blog management
router.post('/create-blog', authenticate, blogController.createBlog);
router.get('/get-blog/:id', authenticate, blogController.getBlogById);
router.put('/update-blog/:id', authenticate, blogController.updateBlog);
router.delete('/delete-blog/:id', authenticate, blogController.deleteBlog);

router.get('/get-blogstudent/:studentId', authenticate, blogController.getStudentBlogs);

// Get all blog posts
router.get('/get-all-blogs', authenticate, blogController.getAllBlogs);


// Blog interactions
router.post('/add-comment/:id/comments', authenticate, blogController.addComment);
router.delete('/delete-comment/:id/comments/:commentId', authenticate, blogController.deleteComment);
router.post('/like-blog/:id/like', authenticate, blogController.toggleLike);
router.post('/like-comment/:id/comments/:commentId/like', authenticate, blogController.likeComment);

// Blog search
router.get('/search', authenticate, blogController.searchBlogs);

module.exports = router;
