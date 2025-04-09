const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authenticate } = require('../middlewares/auth');

// Blog management
router.post('/create-blog', authenticate, blogController.createBlog);
router.get('/get-blogstudent/:studentId', authenticate, blogController.getStudentBlogs);
router.get('/get-blog/:id', authenticate, blogController.getBlogById);
router.put('/update-blog/:id', authenticate, blogController.updateBlog);
router.delete('/delete-blog/:id', authenticate, blogController.deleteBlog);

// Get all blog posts
router.get('/get-all-blogs', authenticate, blogController.getAllBlogs);


// Blog interactions
router.post('/add-comment/:id/comments', authenticate, blogController.addComment);
router.post('/like-blog/:id/like', authenticate, blogController.toggleLike);

// Blog search
router.get('/search', authenticate, blogController.searchBlogs);

module.exports = router;
