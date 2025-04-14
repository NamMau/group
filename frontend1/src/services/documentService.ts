import { authService, API_URL } from './authService';

export interface Document {
  _id: string;
  name: string;
  courseId: string;
  studentId: string;
  filePath: string;
  fileUrl: string;
  submissionDate: string;
  dueDate?: string;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'txt';
  fileSize: number;
  uploadedBy: string;
  course?: string;
  class?: string;
  tags?: string[];
  isPublic: boolean;
  accessLevel: 'public' | 'course' | 'private';
  downloads: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: {
    fullName: string;
    avatar?: string;
  };
}

class DocumentService {
  async getDocumentsByCourse(courseId: string): Promise<Document[]> {
    try {
      const response = await fetch(`${API_URL}/documents/course/${courseId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getDocumentsByCourse:', error);
      throw error;
    }
  }

  async getDocumentById(documentId: string): Promise<Document> {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}`, {
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      throw error;
    }
  }

  async addComment(documentId: string, content: string): Promise<Comment> {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/comments`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  }

  async deleteComment(documentId: string, commentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService(); 