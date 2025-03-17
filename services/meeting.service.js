const Meeting = require('../models/meeting.model');
const { sendEmail } = require('./email.service');

class MeetingService {
    async createMeeting(meetingData) {
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

        // Send meeting invitations
        await this.sendMeetingInvitations(meeting);

        return meeting;
    }

    async getMeetingsByUser(userId, role) {
        const query = role === 'tutor' ? { tutor: userId } : { student: userId };
        return await Meeting.find(query)
            .populate('tutor', 'fullName email')
            .populate('student', 'fullName email')
            .sort({ startTime: 1 });
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

    async sendMeetingInvitations(meeting) {
        const tutor = await meeting.populate('tutor', 'email fullName');
        const student = await meeting.populate('student', 'email fullName');

        // Send to tutor
        await sendEmail({
            to: tutor.email,
            subject: 'New Meeting Scheduled',
            text: `You have a new meeting scheduled with ${student.fullName} on ${meeting.startTime}.`
        });

        // Send to student
        await sendEmail({
            to: student.email,
            subject: 'Meeting Scheduled',
            text: `Your meeting with ${tutor.fullName} has been scheduled for ${meeting.startTime}.`
        });
    }

    async sendMeetingCancellation(meeting) {
        const tutor = await meeting.populate('tutor', 'email fullName');
        const student = await meeting.populate('student', 'email fullName');

        // Send to tutor
        await sendEmail({
            to: tutor.email,
            subject: 'Meeting Cancelled',
            text: `Your meeting with ${student.fullName} scheduled for ${meeting.startTime} has been cancelled.`
        });

        // Send to student
        await sendEmail({
            to: student.email,
            subject: 'Meeting Cancelled',
            text: `Your meeting with ${tutor.fullName} scheduled for ${meeting.startTime} has been cancelled.`
        });
    }
}

module.exports = new MeetingService(); 