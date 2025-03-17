const Blog = require('../models/blog.model');
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
            res.status(201).json(post);
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
        res.json(posts);
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
        res.json(post);
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
            res.json(post);
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

exports.addComment = async (req, res) => {
    try {
        const post = await blogService.addComment(req.params.postId, {
            author: req.user._id,
            content: req.body.content
        });
        res.json(post);
    } catch (error) {
        if (error.message === 'Blog post not found.') {
            res.status(404).json({ message: error.message });
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
        res.json(post);
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
        res.json(post);
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
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
