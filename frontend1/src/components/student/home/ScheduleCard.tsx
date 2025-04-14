"use client";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserGraduate, FaClock, FaVideo } from "react-icons/fa";
import { meetingService, Meeting } from "../../../services/meetingService"; // Import meetingService
import { userService } from "@/services/userService";

interface Tutor {
  _id: string;
  fullName: string;
  email: string;
}

const ScheduleCard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tutors, setTutors] = useState<Record<string, Tutor>>({});

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await meetingService.getAllMeetings();
        setMeetings(data);
        
        // Fetch tutor details for each unique tutorId
        const uniqueTutorIds = [...new Set(data.map(meeting => {
          // Handle both string and object tutorId
          if (typeof meeting.tutorId === 'object' && meeting.tutorId !== null) {
            const tutorObj = meeting.tutorId as { _id: string };
            return tutorObj._id || (meeting.tutorId as any).toString();
          }
          return meeting.tutorId as string;
        }))];
        const tutorDetails: Record<string, Tutor> = {};
        
        await Promise.all(
          uniqueTutorIds.map(async (tutorId) => {
            if (tutorId) {
              const tutor = await userService.getUser(tutorId);
              tutorDetails[tutorId] = tutor;
            }
          })
        );
        
        setTutors(tutorDetails);
      } catch (err) {
        setError("Failed to load meetings");
        console.error("Error fetching meetings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const formatTime = (time: string | Date): string => {
    try {
      if (typeof time === "string") {
        // If time is in HH:mm format
        if (/^\d{2}:\d{2}$/.test(time)) {
          const [hours, minutes] = time.split(":");
          const date = new Date();
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        // If time is a date string
        const date = new Date(time);
        if (isNaN(date.getTime())) throw new Error("Invalid date string");
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      // If time is already a Date object
      return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Time";
    }
  };

  const formatDate = (date: string | Date): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return dateObj.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading schedule...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (meetings.length === 0) {
    return <div className="text-gray-500 text-center py-4">No scheduled meetings</div>;
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div
          key={meeting._id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">
                {meeting.notes || "Untitled Meeting"}
              </h3>
              <p className="text-sm text-gray-600">
                with {tutors[meeting.tutorId]?.fullName || "Unknown Tutor"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {formatTime(meeting.time)}
              </p>
              <p className="text-xs text-gray-600">{formatDate(meeting.date)}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Duration: {meeting.duration} minutes
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleCard;