import EditTeacherForm from './EditTeacherForm';

export const metadata = {
  title: 'Edit Teacher',
};

export default function EditTeacherPage({
  searchParams,
}: {
  searchParams: { teacherId: string };
}) {
  const teacherId = searchParams.teacherId;

  if (!teacherId) {
    return <div>Teacher ID is required</div>;
  }

  return <EditTeacherForm teacherId={teacherId} />;
}