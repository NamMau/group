import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

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

export const documentService = {
  // Get document by ID
  getDocumentById: async (documentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/documents/get-document/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Get student's documents for a course
  getStudentDocuments: async (courseId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/documents/get-documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  },

  // Upload new document
  uploadDocument: async (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  // Update document status
//   updateDocumentStatus: async (documentId: string, status: Document['status']) => {
//     const token = localStorage.getItem('token');
//     const response = await axios.patch(`${API_URL}/documents/${documentId}/status`, 
//       { status },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data.data;
//   },

  // Delete document
  deleteDocument: async (documentId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_URL}/documents/delete/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  }
}; 