import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Students',
};

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 