'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './edit.module.css';

// Định nghĩa interface cho dữ liệu giáo viên
interface Teacher {
  fullName: string;
  email: string;
  class: string;
  password: string;
  phone: string;
  avatar: string;
}

export default function EditTeacherForm({ teacherId }: { teacherId: string }) {
  const router = useRouter();

  // State để lưu thông tin giáo viên
  const [teacher, setTeacher] = useState<Teacher>({
    fullName: '',
    email: '',
    class: '',
    password: '',
    phone: '',
    avatar: '',
  });

  // State để lưu tên file ảnh đại diện (nếu người dùng chọn ảnh mới)
  const [avatarFile, setAvatarFile] = useState<string | null>(null);

  // Lấy dữ liệu giáo viên (giả lập)
  useEffect(() => {
    const fetchTeacher = async () => {
      // Giả lập dữ liệu trả về
      const mockData: Teacher = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        class: 'classA',
        password: 'password123',
        phone: '123-456-7890',
        avatar: '',
      };
      setTeacher(mockData);
    };

    fetchTeacher();
  }, [teacherId]);

  // Xử lý khi nhấn nút "Save Changes"
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // Sử dụng e.currentTarget

    // Gửi dữ liệu cập nhật giáo viên (giả lập)
    const response = await fetch(`/api/teachers/${teacherId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      alert('Teacher updated successfully!');
      router.push('/admin/teachers'); // Chuyển hướng về trang danh sách sau khi lưu
    } else {
      alert('Failed to update teacher');
    }
  };

  // Xử lý khi người dùng chọn ảnh đại diện mới
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file.name);
    }
  };

  return (
    <div className={styles.editTeacher}>
      <h1 className={styles.title}>Edit Teacher</h1>
      <p className={styles.subtitle}>Manually</p>

      <form className={styles.form} onSubmit={handleSaveChanges}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            className={styles.input}
            value={teacher.fullName}
            onChange={(e) => setTeacher({ ...teacher, fullName: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            className={styles.input}
            value={teacher.email}
            onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="class">Class</label>
          <select
            id="class"
            name="class"
            className={styles.input}
            value={teacher.class}
            onChange={(e) => setTeacher({ ...teacher, class: e.target.value })}
            required
          >
            <option value="">Class</option>
            <option value="classA">Class A</option>
            <option value="classB">Class B</option>
            <option value="classC">Class C</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={teacher.password}
            onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone number"
            className={styles.input}
            value={teacher.phone}
            onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="avatar">Avatar</label>
          <div className={styles.avatarInput}>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleAvatarChange}
            />
            <button type="button" className={styles.selectPhotoButton}>
              {avatarFile || teacher.avatar ? `Selected: ${avatarFile || teacher.avatar}` : 'Select photo'}
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}