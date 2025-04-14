"use client";

import React, { useState } from 'react';
import { documentService } from '@/services/documentService';
import styles from './documents.module.css';

interface CommentFormProps {
  documentId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ documentId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await documentService.addComment(documentId, content);
      setContent('');
      onCommentAdded();
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <div className={styles.formGroup}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          className={styles.commentInput}
          rows={3}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
} 