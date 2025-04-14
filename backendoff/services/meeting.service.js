const Meeting = require('../models/meeting.model');
const User = require('../models/user.model');
const Class = require('../models/class.model'); // Import model Class
const NotificationService = require('../services/notification.service');

class MeetingService {
  async createMeeting(meetingData) {
    // Bỏ đoạn xử lý studentIds, vì giờ mình nhận classId
    // if (meetingData.studentIds) {
    //         meetingData.students = meetingData.studentIds;
    //         delete meetingData.studentIds;
    //      }

    // if (!Array.isArray(meetingData.students)) {
    //         throw new Error('Students field must be an array.');
    //      }

    // if (meetingData.tutor && typeof meetingData.tutor === 'object') {
    //         meetingData.tutor = meetingData.tutor._id;
    //      }

    // if (meetingData.course && typeof meetingData.course === 'object') {
    //         meetingData.course = meetingData.course._id;
    //      }

    meetingData.startTime = new Date(meetingData.startTime);
    meetingData.endTime = new Date(meetingData.endTime);

    // Kiểm tra classId
    if (!meetingData.classId) {
      throw new Error('Class ID is required.');
    }

    // 1. Lấy thông tin lớp học
    const classData = await Class.findById(meetingData.classId)
      .populate('tutor', '_id') // Chỉ cần _id của tutor
      .populate('students', '_id') // Chỉ cần _id của students
      .populate('courses', '_id'); // Chỉ cần _id của courses

    if (!classData) {
      throw new Error('Class not found.');
    }

    // Lấy thông tin tutor, students, course từ classData
    const tutorId = classData.tutor._id;
    const studentIds = classData.students.map(student => student._id); // Lấy danh sách _id
    const courseId = classData.courses[0]._id; // Lấy course đầu tiên từ mảng courses


    const studentsExist = await User.find({ _id: { $in: studentIds } });
    if (studentsExist.length !== studentIds.length) {
      throw new Error('Some students do not exist.');
    }

    // Kiểm tra lịch trùng của tutor
    const existingMeeting = await Meeting.findOne({
      tutorId: tutorId,
      startTime: { $lt: meetingData.endTime },
      endTime: { $gt: meetingData.startTime }
    });

    if (existingMeeting) {
      throw new Error('Tutor has a scheduling conflict.');
    }

    // Tạo đối tượng meeting
    const meeting = new Meeting({
      courseId: courseId,
      students: studentIds,
      tutorId: tutorId,
      startTime: meetingData.startTime,
      endTime: meetingData.endTime,
      date: meetingData.date || new Date(meetingData.startTime),
      time: meetingData.time || meetingData.startTime.toTimeString().slice(0, 5),
      duration: meetingData.duration || 60,
      status: 'scheduled',
      notes: meetingData.notes || '',
      classId: meetingData.classId
    });

    await meeting.save();

    // Tạo meetingLink sau khi lưu để có meeting._id
    meeting.meetingLink = `${process.env.FRONTEND_URL}/meetings/${meeting._id}`;
    await meeting.save();

    // Gửi thông báo
    await this.sendMeetingInvitations(meeting);

    return meeting;
  }

  async getMeetings(filter) {
    // Check if filter is an object and has the required properties
    return await Meeting.find(filter)
      .populate({
        path: 'tutorId',
        select: 'fullName email'
      })
      .populate({
        path: 'students',
        select: 'fullName email'
      })
      .populate({
        path: 'courseId',
        select: 'name description'
      })
      .populate({
        path: 'classId',
        select: 'name'
      })
      .sort({ date: 1, time: 1 });
  }


  async getMeetingsByUser(userId, role) {
    let query = {};
    if (role === 'tutor') {
      query.tutorId = userId;
    }
    else {
      query.students = userId;
    }
    return await Meeting.find(query)
      .populate({
        path: 'tutorId',
        select: 'fullName email'
      })
      .populate({
        path: 'students',
        select: 'fullName email'
      })
      .populate({
        path: 'courseId',
        select: 'name description'
      })
      .populate({
        path: 'classId',
        select: 'name'
      })
      .sort({ startTime: 1 });
  }

  async getMeetingById(meetingId) {
    const meeting = await Meeting.findById(meetingId)
      .populate({
        path: 'tutorId',
        select: 'fullName email'
      })
      .populate({
        path: 'students',
        select: 'fullName email'
      })
      .populate({
        path: 'courseId',
        select: 'name description'
      })
      .populate({
        path: 'classId',
        select: 'name'
      });
    if (!meeting) {
      throw new Error('Meeting not found.');
    }
    return meeting;
  }


  async updateMeeting(meetingId, updateData) {
    const meeting = await Meeting.findByIdAndUpdate(meetingId, updateData, { new: true });
    if (!meeting) {
      throw new Error('Meeting not found.');
    }
    return meeting;
  }

  async cancelMeeting(meetingId) {
    const meeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { status: 'cancelled' },
      { new: true }
    );
    if (!meeting) {
      throw new Error('Meeting not found.');
    }

    // Send cancellation notifications
    await this.sendMeetingCancellation(meeting);

    return meeting;
  }

  async deleteMeeting(meetingId) {
    const meeting = await Meeting.findByIdAndDelete(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found.');
    }
    return meeting;
  }

  async sendMeetingInvitations(meeting) {
    const populatedMeeting = await meeting.populate([
      { path: 'tutorId', select: 'email fullName' },
      { path: 'students', select: 'email fullName' }
    ]);
    const tutor = populatedMeeting.tutorId;
    const students = populatedMeeting.students;

    // Format meeting time for notification
    const formattedMeetingTime = `${new Date(meeting.date).toLocaleDateString()} at ${meeting.time}`;

    try {
      // Send to tutor
      await NotificationService.createNotification({
        user: tutor._id,
        message: `You have a new meeting scheduled with ${students.length} students on ${formattedMeetingTime}.`
      });

      // Send to students
      for (const student of students) {
        await NotificationService.createNotification({
          user: student._id,
          message: `Your meeting with ${tutor.fullName} has been scheduled for ${formattedMeetingTime}.`
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      // Don't throw the error to prevent blocking the meeting creation
    }
  }

  async sendMeetingCancellation(meeting) {
    const populatedMeeting = await meeting.populate([
      { path: 'tutorId', select: 'email fullName' },
      { path: 'students', select: 'email fullName' }
    ]);
    const tutor = populatedMeeting.tutorId;
    const students = populatedMeeting.students;
    const formattedMeetingTime = `${new Date(meeting.date).toLocaleDateString()} at ${meeting.time}`;

    try {
      // Send to tutor
      await NotificationService.createNotification({
        user: tutor._id,
        message: `Your meeting with ${students.length} students scheduled for ${formattedMeetingTime} has been cancelled.`
      });

      // Send to students
      for (const student of students) {
        await NotificationService.createNotification({
          user: student._id,
          message: `Your meeting with ${tutor.fullName} scheduled for ${formattedMeetingTime} has been cancelled.`
        });
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      // Don't throw the error to prevent blocking the meeting cancellation
    }
  }

  async getMeetingSchedule(filter) {
    const query = {};

    if (filter.courseId) {
      query.courseId = filter.courseId;
    }

    if (filter.classId) {
      query.classId = filter.classId;
    }

    if (filter.startDate && filter.endDate) {
      query.date = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate)
      };
    }

    return await Meeting.find(query)
      .populate({
        path: 'tutorId',
        select: 'fullName email'
      })
      .populate({
        path: 'students',
        select: 'fullName email'
      })
      .populate({
        path: 'courseId',
        select: 'name description'
      })
      .populate({
        path: 'classId',
        select: 'name'
      })
      .sort({ date: 1, time: 1 });
  }

  async getUpcomingMeetings(userId, role) {
    let query = {};
    if (role === 'tutor') {
      query.tutorId = userId;
    } else {
      query.students = userId;
    }
    query.date = { $gte: new Date() };

    return await Meeting.find(query)
      .populate({
        path: 'tutorId',
        select: 'fullName email'
      })
      .populate({
        path: 'students',
        select: 'fullName email'
      })
      .populate({
        path: 'courseId',
        select: 'name description'
      })
      .populate({
        path: 'classId',
        select: 'name'
      })
      .sort({ date: 1, time: 1 });
  }

  async joinMeeting(meetingId, userId) {
    try {
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.participants.length >= meeting.maxParticipants) {
        throw new Error('Meeting is full');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      meeting.participants.push(user._id);
      await meeting.save();

      return meeting;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  async getMeetingsByTutor(tutorId) {
    try {
      const meetings = await Meeting.find({ tutorId })
        .sort({ date: 1, time: 1 })
        .populate('students', 'fullName email')
        .populate('courseId', 'name')
        .populate('classId', 'name');

      return meetings;
    } catch (error) {
      console.error('Error in getMeetingsByTutor:', error);
      throw error;
    }
  }

  async cancelMeeting(meetingId, userId, reason) {
    try {
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.tutorId.toString() !== userId.toString()) {
        throw new Error('Not authorized to cancel this meeting');
      }

      meeting.status = 'cancelled';
      meeting.cancelledBy = userId;
      meeting.cancellationReason = reason;
      await meeting.save();

      return meeting;
    } catch (error) {
      console.error('Error in cancelMeeting:', error);
      throw error;
    }
  }
}

module.exports = new MeetingService();
