'use client';

import { useState } from 'react';
import { blogService } from '@/services/blogService';
import { authService } from '@/services/authService'; // 👉 Thêm dòng này
import { useRouter } from 'next/navigation';

const CreateBlog = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'course' | 'private'>('public');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  const handleCreate = async () => {
    try {
      const user = authService.getUser();
      if (!user || !user._id) {
        alert('Cannot found user information. Please login again.');
        return;
      }

      const newPost = await blogService.createPost({
        title,
        content,
        tags,
        visibility,
        status,
      });

      console.log('Blog created:', newPost);
      router.push(`/student/blog`);
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Create post failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create new Blog</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-3 h-40"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags.join(',')}
        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        className="w-full p-2 border rounded mb-3"
      />

      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value as any)}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="public">Public</option>
        <option value="course">Course</option>
        <option value="private">Private</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>

      <button
        onClick={handleCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Create Blog
      </button>
    </div>
  );
};

export default CreateBlog;
