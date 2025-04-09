// EditBlog.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { blogService } from '../../../../services/blogService';

type Visibility = 'private' | 'public' | 'course';

const EditBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    visibility: 'private' as Visibility,
    //featuredImage: '',
    author: {
      fullName: '', // Initialize author info
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blog = await blogService.getBlogById(id as string); // Fetch the existing blog data
        setBlogData({
          title: blog.title,
          content: blog.content,
          tags: blog.tags,
          visibility: blog.visibility,
          //featuredImage: blog.featuredImage,
          author: blog.author, // Include author info
        });
      } catch (err) {
        console.error("Error fetching blog data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await blogService.updatePost(id as string, blogData); // Update the blog
      router.push('/tutor/blog'); // Redirect after success
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={blogData.title}
          onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
        />
      </label>
      <label>
        Content:
        <textarea
          value={blogData.content}
          onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
        />
      </label>
      <label>
      </label>
      <label>
        Visibility:
        <select
          value={blogData.visibility}
          onChange={(e) => setBlogData({ ...blogData, visibility: e.target.value as Visibility})}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </label>
      <label>
        {/* Featured Image:
        <input
          type="text"
          value={blogData.featuredImage}
          onChange={(e) => setBlogData({ ...blogData, featuredImage: e.target.value })}
        /> */}
         Author:
        <input
          type="text"
          value={blogData.author.fullName} // Display author's full name
          disabled // Make it read-only
        />
      </label>
      <button type="submit">Update Blog</button>
    </form>
  );
};

export default EditBlog;
