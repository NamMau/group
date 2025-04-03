export const metadata = {
  title: 'Admin Classes',
  description: 'Manage classes in the eTutoring system',
};

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 