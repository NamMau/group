const Document = require('../models/document.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Class = require('../models/class.model');
import NotificationService from './notification.service';

class DocumentService {
    async uploadDocument(documentData, file) {
        // Validate uploader
        const uploader = await User.findById(documentData.uploadedBy);
        if (!uploader) {
            throw new Error('Uploader not found.');
        }

        // Validate course if specified
        if (documentData.course) {
            const course = await Course.findById(documentData.course);
            if (!course) {
                throw new Error('Course not found.');
            }
        }

        // Validate class if specified
        if (documentData.class) {
            const classObj = await Class.findById(documentData.class);
            if (!classObj) {
                throw new Error('Class not found.');
            }
        }

        // Create document
        const document = new Document({
            ...documentData,
            fileUrl: file.path,
            fileType: file.mimetype,
            fileSize: file.size
        });
        await document.save();

            // Send notifications to relevant users (nếu cần)
        await NotificationService.createNotification({
            recipientId: uploader._id,
            message: `Your document "${document.name}" has been uploaded successfully.`
        });

        return document;
    }

    async getDocuments(filters = {}) {
        const query = { ...filters };
        
        // If user is not admin, only show documents they have access to
        if (filters.userId && !filters.isAdmin) {
            query.$or = [
                { uploadedBy: filters.userId },
                { accessLevel: 'public' },
                { course: { $in: await this.getUserCourseIds(filters.userId) } }
            ];
        }

        return await Document.find(query)
            .populate('uploadedBy', 'fullName email')
            .populate('course', 'name')
            .populate('class', 'name')
            .sort({ createdAt: -1 });
    }

    async getDocumentById(documentId, userId) {
        const document = await Document.findById(documentId)
            .populate('uploadedBy', 'fullName email')
            .populate('course', 'name')
            .populate('class', 'name');

        if (!document) {
            throw new Error('Document not found.');
        }

        // Check access permission
        if (!this.hasAccess(document, userId)) {
            throw new Error('Access denied.');
        }

        // Increment view count
        document.views += 1;
        await document.save();

        return document;
    }

    async updateDocument(documentId, updateData, userId) {
        const document = await Document.findById(documentId);
        if (!document) {
            throw new Error('Document not found.');
        }

        // Check ownership
        if (document.uploadedBy.toString() !== userId) {
            throw new Error('Unauthorized to update this document.');
        }

        // Update document
        Object.assign(document, updateData);
        await document.save();

        return document;
    }

    async deleteDocument(documentId, userId) {
        const document = await Document.findById(documentId);
        if (!document) {
            throw new Error('Document not found.');
        }

        // Check ownership
        if (document.uploadedBy.toString() !== userId) {
            throw new Error('Unauthorized to delete this document.');
        }

        await document.remove();
        return { message: 'Document deleted successfully.' };
    }

    async incrementDownloadCount(documentId) {
        const document = await Document.findById(documentId);
        if (!document) {
            throw new Error('Document not found.');
        }

        document.downloads += 1;
        await document.save();

        return document;
    }

    async searchDocuments(query, filters = {}) {
        const searchQuery = {
            $text: { $search: query },
            ...filters
        };

        return await Document.find(searchQuery)
            .populate('uploadedBy', 'fullName email')
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

    hasAccess(document, userId) {
        if (document.accessLevel === 'public') return true;
        if (document.uploadedBy.toString() === userId) return true;
        if (document.accessLevel === 'course' && document.course) {
            // Check if user is enrolled in or teaching the course
            return this.isUserInCourse(userId, document.course);
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

    async notifyRelevantUsers(document) {
        let recipients = [];

        if (document.course) {
            const course = await Course.findById(document.course);
            if (course) {
                // Add course students and tutor
                recipients = [...course.students, course.tutor];
            }
        }

        if (document.class) {
            const classObj = await Class.findById(document.class);
            if (classObj) {
                // Add class students and tutor
                recipients = [...recipients, ...classObj.students, classObj.tutor];
            }
        }

        // Remove duplicates and the uploader
        recipients = [...new Set(recipients)].filter(id => id.toString() !== document.uploadedBy.toString());

        // Send notifications
        for (const userId of recipients) {
            const user = await User.findById(userId);
            if (user && user.preferences.documentNotifications) {
                await sendEmail({
                    to: user.email,
                    subject: 'New Document Available',
                    text: `A new document "${document.title}" has been uploaded.`
                });
            }
        }
    }
}

module.exports = new DocumentService(); 