const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const { createNotification } = require('../services/notification.service');
const blogService = require('../services/blog.service');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/blog-images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed.'));
        }
    }
});

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
    try {
        // Lấy các bài blog mà không có điều kiện (hoặc có thể thêm các điều kiện khác)
        const blogs = await Blog.find({})
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('comments.author', 'fullName email')
            .sort({ createdAt: -1 });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found' });
        }

        res.json({data:blogs});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts: ' + error.message });
    }
};

// Create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content, courseId, tags, visibility, featuredImage } = req.body;
        const userId = req.user._id;

        // Verify course if specified
        if (courseId) {
            const course = await Course.findOne({
                _id: courseId,
                students: userId
            });
            if (!course) {
                return res.status(404).json({ message: 'Course not found or student not enrolled' });
            }
        }

        const blog = new Blog({
            title,
            content,
            author: userId,
            course: courseId,
            tags,
            visibility,
            featuredImage
        });

        await blog.save();
        res.status(201).json({data:blog});
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post: ' + error.message });
    }
};

// Get all blog posts for a student
exports.getStudentBlogs = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, visibility, courseId } = req.query;

        const query = { author: studentId };
        if (status) query.status = status;
        if (visibility) query.visibility = visibility;
        if (courseId) query.course = courseId;

        const blogs = await Blog.find(query)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .sort({ createdAt: -1 });

        res.json({data: blogs});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts: ' + error.message });
    }
};

// Get a specific blog post
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('comments.author', 'fullName');

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.json({data: blog});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post: ' + error.message });
    }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, tags, visibility, featuredImage } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this blog post' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = tags || blog.tags;
        blog.visibility = visibility || blog.visibility;
        blog.featuredImage = featuredImage || blog.featuredImage;

        await blog.save();
        res.json({data: blog});
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog post: ' + error.message });
    }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this blog post' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error in deleteBlog:', error);
        res.status(500).json({ message: 'Error deleting blog post: ' + error.message });
    }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        blog.comments.push({
            author: req.user._id,
            content
        });

        await blog.save();
        
        // Populate the blog with author information after saving
        const populatedBlog = await Blog.findById(blog._id)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('comments.author', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({data: populatedBlog});
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment: ' + error.message });
    }
};

// Like/Unlike a blog post
exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const likeIndex = blog.likes.indexOf(req.user._id);
        if (likeIndex === -1) {
            blog.likes.push(req.user._id);
        } else {
            blog.likes.splice(likeIndex, 1);
        }

        await blog.save();

        // Return populated blog
        const populatedBlog = await Blog.findById(blog._id)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('comments.author', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: 'Like status updated',
            data: populatedBlog
        });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like: ' + error.message });
    }
};

// Search blog posts
exports.searchBlogs = async (req, res) => {
    try {
        const { query, courseId, tags } = req.query;
        const searchQuery = {};

        if (query) {
            searchQuery.$text = { $search: query };
        }
        if (courseId) {
            searchQuery.course = courseId;
        }
        if (tags) {
            searchQuery.tags = { $in: tags.split(',') };
        }

        const blogs = await Blog.find(searchQuery)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .sort({ createdAt: -1 });

        res.json({data:blogs});
    } catch (error) {
        res.status(500).json({ message: 'Error searching blog posts: ' + error.message });
    }
};

exports.createPost = [
    upload.single('featuredImage'),
    async (req, res) => {
        try {
            const postData = {
                ...req.body,
                author: req.user._id,
                featuredImage: req.file ? `/uploads/blog-images/${req.file.filename}` : undefined
            };

            const post = await blogService.createPost(postData);
            res.status(201).json({ data:post});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

exports.getPosts = async (req, res) => {
    try {
        const filters = {
            userId: req.user._id,
            isAdmin: req.user.role === 'admin',
            ...req.query
        };

        const posts = await blogService.getPosts(filters);
        res.json({data: posts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await blogService.getPostById(
            req.params.postId,
            req.user._id
        );
        res.json({data: post});
    } catch (error) {
        if (error.message === 'Blog post not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Access denied.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.updatePost = [
    upload.single('featuredImage'),
    async (req, res) => {
        try {
            const updateData = {
                ...req.body,
                featuredImage: req.file ? `/uploads/blog-images/${req.file.filename}` : undefined
            };

            const post = await blogService.updatePost(
                req.params.postId,
                updateData,
                req.user._id
            );
            res.json({data: post});
        } catch (error) {
            if (error.message === 'Blog post not found.') {
                res.status(404).json({ message: error.message });
            } else if (error.message === 'Unauthorized to update this post.') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
];

exports.deletePost = async (req, res) => {
    try {
        const result = await blogService.deletePost(
            req.params.postId,
            req.user._id
        );
        res.json(result);
    } catch (error) {
        if (error.message === 'Blog post not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Unauthorized to delete this post.') {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await blogService.likePost(
            req.params.postId,
            req.user._id
        );
        res.json({data: post});
    } catch (error) {
        if (error.message === 'Blog post not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.likeComment = async (req, res) => {
    try {
        const post = await blogService.likeComment(
            req.params.postId,
            req.params.commentId,
            req.user._id
        );
        res.json({data: post});
    } catch (error) {
        if (error.message === 'Blog post not found.') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Comment not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.searchPosts = async (req, res) => {
    try {
        const posts = await blogService.searchPosts(
            req.query.q,
            {
                userId: req.user._id,
                isAdmin: req.user.role === 'admin',
                ...req.query
            }
        );
        res.json({data: posts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment from a blog post
exports.deleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const blog = await Blog.findById(postId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Find the comment
        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is authorized to delete the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove the comment and save
        blog.comments.pull({ _id: commentId });
        await blog.save();

        // Return populated blog
        const populatedBlog = await Blog.findById(postId)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('comments.author', 'fullName email')
            .sort({ createdAt: -1 });

        res.json({ data: populatedBlog });
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).json({ message: 'Error deleting comment: ' + error.message });
    }
};
