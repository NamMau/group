const meetingService = require('../services/meeting.service');
const { getIO } = require('../config/socket');

// Meeting management
exports.createMeeting = async (req, res) => {
    try {
        const meeting = await meetingService.createMeeting(req.body);
        res.status(201).json(meeting);
    } catch (error) {
        if (error.message === 'Tutor has a scheduling conflict.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.getMeetings = async (req, res) => {
    try {
        const { courseId, classId, status, startDate, endDate } = req.query;
        const meetings = await meetingService.getMeetings({
            courseId,
            classId,
            status,
            startDate,
            endDate
        });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMeetingById = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await meetingService.getMeetingById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await meetingService.updateMeeting(meetingId, req.body);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        // Emit meeting update through Socket.IO
        const io = getIO();
        io.to(`meeting_${meeting._id}`).emit('meeting_updated', meeting);

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        await meetingService.deleteMeeting(meetingId);

        // Emit meeting deletion through Socket.IO
        const io = getIO();
        io.to(`meeting_${meetingId}`).emit('meeting_deleted', { meetingId });

        res.json({ message: 'Meeting deleted successfully.' });
    } catch (error) {
        if (error.message === 'Meeting not found.') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// Meeting participation
exports.joinMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { userId } = req.body;
        const meeting = await meetingService.joinMeeting(meetingId, userId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        // Emit user joined through Socket.IO
        const io = getIO();
        io.to(`meeting_${meeting._id}`).emit('user_joined', {
            userId: userId,
            timestamp: new Date()
        });

        res.json(meeting);
    } catch (error) {
        if (error.message === 'Meeting is full.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.leaveMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { userId } = req.body;
        const meeting = await meetingService.leaveMeeting(meetingId, userId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        // Emit user left through Socket.IO
        const io = getIO();
        io.to(`meeting_${meeting._id}`).emit('user_left', {
            userId: userId,
            timestamp: new Date()
        });

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMeetingParticipants = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const participants = await meetingService.getMeetingParticipants(meetingId);
        if (!participants) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Meeting feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { userId, rating, comment } = req.body;
        const feedback = await meetingService.submitFeedback(meetingId, userId, { rating, comment });
        if (!feedback) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMeetingFeedback = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const feedback = await meetingService.getMeetingFeedback(meetingId);
        if (!feedback) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Meeting recording
exports.startRecording = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const recording = await meetingService.startRecording(meetingId);
        if (!recording) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(recording);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stopRecording = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const recording = await meetingService.stopRecording(meetingId);
        if (!recording) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(recording);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMeetingRecordings = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const recordings = await meetingService.getMeetingRecordings(meetingId);
        if (!recordings) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Meeting schedule
exports.getMeetingSchedule = async (req, res) => {
    try {
        const { courseId, classId, startDate, endDate } = req.query;
        const schedule = await meetingService.getMeetingSchedule({
            courseId,
            classId,
            startDate,
            endDate
        });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUpcomingMeetings = async (req, res) => {
    try {
        const { userId, role } = req.query;
        const meetings = await meetingService.getUpcomingMeetings(userId, role);
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
