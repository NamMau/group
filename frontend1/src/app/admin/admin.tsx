import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}