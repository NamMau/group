'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './edit.module.css';
import { userService, Tutor } from '../../../../services/userService';
import { authService } from '../../../../services/authService';

import EditTeacherForm from './EditTeacherForm';

export const metadata = {
  title: 'Edit Teacher',
};

export default async function EditTeacherPage({
  searchParams,
}: {
  searchParams: { tutorId: string };
}) {
  const tutorId = searchParams.tutorId;

  if (!tutorId) {
    return <div>Teacher ID is required</div>;
  }

  return <EditTeacherForm tutorId={tutorId} />;
}