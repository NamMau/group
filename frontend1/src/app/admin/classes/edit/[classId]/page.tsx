'use client';

import { useParams } from 'next/navigation';
import EditClass from '../EditClass';

export default function EditClassPage() {
    const { classId } = useParams() as { classId: string };
    return <EditClass classId={classId} />;
}
