import EditTeacherForm from './EditTeacherForm';

export const metadata = {
  title: 'Edit Teacher',
};

export default function EditTeacherPage({
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