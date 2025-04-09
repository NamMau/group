const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Class = require('../models/class.model');
const { sendEmail } = require('./email.service');

class BlogService {
    // Get all blogs from database
    async getAllBlogs() {
        try {
            const blogs = await Blog.find({})
                .populate('author', 'fullName email')
                .populate('course', 'name')
                .sort({ createdAt: -1 });
            return blogs;
        } catch (error) {
            throw new Error('Error fetching blogs: ' + error.message);
        }
    };

    
    async createPost(postData) {
        // Validate author
        const author = await User.findById(postData.author);
        if (!author) {
            throw new Error('Author not found.');
        }

        // Validate course if specified
        if (postData.course) {
            const course = await Course.findById(postData.course);
            if (!course) {
                throw new Error('Course not found.');
            }
        }

        // Validate class if specified
        if (postData.class) {
            const classObj = await Class.findById(postData.class);
            if (!classObj) {
                throw new Error('Class not found.');
            }
        }

        // Create blog post
        const post = new Blog(postData);
        await post.save();

        // If post is published, notify relevant users
        if (post.status === 'published') {
            await this.notifyRelevantUsers(post);
        }

        return post;
    }

    async getPosts(filters = {}) {
        const query = { ...filters };
        
        // If user is not admin, only show posts they have access to
        if (filters.userId && !filters.isAdmin) {
            query.$or = [
                { author: filters.userId },
                { visibility: 'public' },
                { course: { $in: await this.getUserCourseIds(filters.userId) } }
            ];
        }

        // Only show published posts for non-authors
        if (!filters.isAdmin && (!filters.userId || filters.userId !== query.author)) {
            query.status = 'published';
        }

        return await Blog.find(query)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('class', 'name')
            .sort({ createdAt: -1 });
    }

    async getPostById(postId, userId) {
        const post = await Blog.findById(postId)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('class', 'name')
            .populate('comments.author', 'fullName email');

        if (!post) {
            throw new Error('Blog post not found.');
        }

        // Check access permission
        if (!this.hasAccess(post, userId)) {
            throw new Error('Access denied.');
        }

        // Increment view count
        post.views += 1;
        await post.save();

        return post;
    }

    async updatePost(postId, updateData, userId) {
        const post = await Blog.findById(postId);
        if (!post) {
            throw new Error('Blog post not found.');
        }

        // Check ownership
        if (post.author.toString() !== userId) {
            throw new Error('Unauthorized to update this post.');
        }

        // Update post
        Object.assign(post, updateData);
        await post.save();

        // If post is newly published, notify relevant users
        if (updateData.status === 'published' && post.status === 'published') {
            await this.notifyRelevantUsers(post);
        }

        return post;
    }

    async deletePost(postId, userId) {
        const post = await Blog.findById(postId);
        if (!post) {
            throw new Error('Blog post not found.');
        }

        // Check ownership
        if (post.author.toString() !== userId) {
            throw new Error('Unauthorized to delete this post.');
        }

        await post.remove();
        return { message: 'Blog post deleted successfully.' };
    }

    async addComment(postId, commentData) {
        const post = await Blog.findById(postId);
        if (!post) {
            throw new Error('Blog post not found.');
        }

        // Add comment
        post.comments.push({
            author: commentData.author,
            content: commentData.content
        });
        await post.save();

        // Notify post author
        await this.notifyComment(post);

        return post;
    }

    async likePost(postId, userId) {
        const post = await Blog.findById(postId);
        if (!post) {
            throw new Error('Blog post not found.');
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        return post;
    }

    async likeComment(postId, commentId, userId) {
        const post = await Blog.findById(postId);
        if (!post) {
            throw new Error('Blog post not found.');
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            throw new Error('Comment not found.');
        }

        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(likeIndex, 1);
        }

        await post.save();
        return post;
    }

    async searchPosts(query, filters = {}) {
        const searchQuery = {
            $text: { $search: query },
            ...filters
        };

        return await Blog.find(searchQuery)
            .populate('author', 'fullName email')
            .populate('course', 'name')
            .populate('class', 'name')
            .sort({ score: { $meta: 'textScore' } });
    }

    // Helper methods
    async getUserCourseIds(userId) {
        const user = await User.findById(userId);
        if (!user) return [];

        if (user.role === 'student') {
            return user.enrolledCourses.map(course => course.course);
        } else if (user.role === 'tutor') {
            return user.teachingCourses.map(course => course.course);
        }

        return [];
    }

    hasAccess(post, userId) {
        if (post.visibility === 'public') return true;
        if (post.author.toString() === userId) return true;
        if (post.visibility === 'course' && post.course) {
            return this.isUserInCourse(userId, post.course);
        }
        return false;
    }

    async isUserInCourse(userId, courseId) {
        const user = await User.findById(userId);
        if (!user) return false;

        if (user.role === 'student') {
            return user.enrolledCourses.some(course => course.course.toString() === courseId.toString());
        } else if (user.role === 'tutor') {
            return user.teachingCourses.some(course => course.course.toString() === courseId.toString());
        }

        return false;
    }

    async notifyRelevantUsers(post) {
        let recipients = [];

        if (post.course) {
            const course = await Course.findById(post.course);
            if (course) {
                recipients = [...course.students, course.tutor];
            }
        }

        if (post.class) {
            const classObj = await Class.findById(post.class);
            if (classObj) {
                recipients = [...recipients, ...classObj.students, classObj.tutor];
            }
        }

        // Remove duplicates and the author
        recipients = [...new Set(recipients)].filter(id => id.toString() !== post.author.toString());

        // Send notifications
        for (const userId of recipients) {
            const user = await User.findById(userId);
            if (user && user.preferences.blogNotifications) {
                await sendEmail({
                    to: user.email,
                    subject: 'New Blog Post',
                    text: `A new blog post "${post.title}" has been published.`
                });
            }
        }
    }

    async notifyComment(post) {
        const author = await User.findById(post.author);
        if (author && author.preferences.commentNotifications) {
            await sendEmail({
                to: author.email,
                subject: 'New Comment on Your Blog Post',
                text: `Your blog post "${post.title}" has received a new comment.`
            });
        }
    }
}

module.exports = new BlogService(); 