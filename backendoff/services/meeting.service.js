const Meeting = require('../models/meeting.model');
const User = require('../models/user.model');
const NotificationService = require('../services/notification.service');

class MeetingService {
    async createMeeting(meetingData) {
         // if rq body has studentIds, convert it to students
         if (meetingData.studentIds) {
            meetingData.students = meetingData.studentIds;
            delete meetingData.studentIds;
        }
        
        if (!Array.isArray(meetingData.students)) {
            throw new Error('Students field must be an array.');
        }

        //check if all students exist
        const studentsExist = await User.find({_id: {$in:meetingData.students}});
        if(studentsExist.length !== meetingData.students.length) {
            throw new Error('Some students do not exist.');
        }
        // Check for scheduling conflicts
        const existingMeeting = await Meeting.findOne({
            tutor: meetingData.tutor,
            startTime: { $lt: meetingData.endTime },
            endTime: { $gt: meetingData.startTime }
        });

        if (existingMeeting) {
            throw new Error('Tutor has a scheduling conflict.');
        }

        const meeting = new Meeting(meetingData);
        await meeting.save();

        // create meetingLink base on _id is created
        meeting.meetingLink = `${process.env.FRONTEND_URL}/meetings/${meeting._id}`;
        await meeting.save();

        // Send meeting invitations
        await this.sendMeetingInvitations(meeting);

        return meeting;
    }

    async getMeetings(filter) {
        // Check if filter is an object and has the required properties
        return await Meeting.find(filter)
            .populate('tutorId', 'fullName email')
            .populate('students', 'fullName email')
            .sort({ date: 1, time: 1 });
    }
    

    async getMeetingsByUser(userId, role) {
        let query = {};
        if(role === 'tutor') {
            query = {tutor: userId};
        }
        else{
            query = {students: userId};
        }
        return await Meeting.find(query)
            .populate('tutorId', 'fullName email')
            .populate('students', 'fullName email')
            .sort({ startTime: 1 });
    }

    async getMeetingById(meetingId) {
        const meeting = await Meeting.findById(meetingId)
          .populate('tutorId', 'fullName email')
          .populate('students', 'fullName email');
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
        const tutor = populatedMeeting .tutorId;
        const students = populatedMeeting.students;

        // Format meeting time for notification
        const formattedMeetingTime = `${new Date(meeting.date).toLocaleDateString()} at ${meeting.time}`;

        // Send to tutor
        await NotificationService.createNotification({
            recipientId: tutor._id,
            message: `You have a new meeting scheduled with ${students.length} students on ${formattedMeetingTime}.`
        });

        // Send to student
       for (const student of students) {
         await NotificationService.createNotification({
             recipientId: student._id,
             message: `Your meeting with ${tutor.fullName} has been scheduled for ${formattedMeetingTime}.`
         });
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

        // Send to tutor
        await NotificationService.createNotification({
            recipientId: tutor._id,
            message: `Your meeting with ${students.length} students scheduled for ${formattedMeetingTime} has been cancelled.`
        });

        // Send to student
        for (const student of students) {
            await NotificationService.createNotification({
                recipientId: student._id,
                message: `Your meeting with ${tutor.fullName} scheduled for ${formattedMeetingTime} has been cancelled.`
            });
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
        
        //filter by property status
        if (filter.startDate && filter.endDate) {
            query.date = {
                $gte: new Date(filter.startDate),
                $lte: new Date(filter.endDate)
            };
        }
        
        //find meetings by tutor and student
        return await Meeting.find(query)
            .populate('tutorId', 'fullName email')
            .populate('students', 'fullName email')
            .sort({ date: 1, time: 1 });
    }

    async getUpcomingMeetings(userId, role) {
        let query = {};
        if (role === 'tutor') {
            query.tutorId = userId;
        } else {
            query.students = userId;
        }
        // Check for upcoming meetings
        query.date = { $gte: new Date() };
    
        return await Meeting.find(query)
            .populate('tutorId', 'fullName email')
            .populate('students', 'fullName email')
            .sort({ date: 1, time: 1 });
    }
    // Hàm joinMeeting
    async joinMeeting(meetingId, userId){
        try {
        // Lấy cuộc họp theo ID
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            throw new Error('Meeting not found');
        }
    
        // Kiểm tra xem cuộc họp có chỗ trống không
        if (meeting.participants.length >= meeting.maxParticipants) {
            throw new Error('Meeting is full');
        }
    
        // Thêm người tham gia vào cuộc họp
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
    
        // Cập nhật lại cuộc họp với người dùng tham gia
        meeting.participants.push(user._id);
        await meeting.save();
    
        // Trả về thông tin cuộc họp đã được cập nhật
        return meeting;
        } catch (error) {
        throw new Error(error.message);
        }
    };
    
}

module.exports = new MeetingService(); 