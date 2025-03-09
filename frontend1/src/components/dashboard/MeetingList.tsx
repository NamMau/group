import React from "react";
import MeetingItem from "@/components/dashboard/MeetingItem";

const meetings = [
  { chairperson: "Tran Van Truong", course: "Information technology", date: "20/09/2025", time: "12:00 PM" },
  { chairperson: "Tran Van Truong", course: "Information technology", date: "20/09/2025", time: "12:00 PM" },
  { chairperson: "Tran Van Truong", course: "Information technology", date: "20/09/2025", time: "12:00 PM" },
];

const MeetingList: React.FC = () => {
  return (
    <div className="space-y-4">
      {meetings.map((meeting, index) => (
        <MeetingItem key={index} {...meeting} />
      ))}
    </div>
  );
};

export default MeetingList;