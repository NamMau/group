const meetingService = require('../services/meeting.service');
const { getIO } = require('../config/socket');
const Meeting = require('../models/meeting.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); // You'll need this for decoding the token
require('dotenv').config(); // Load environment variables

// Meeting management
exports.createMeeting = async (req, res) => {
  try {
    const meetingData = {
      ...req.body,
      createdBy: req.user._id, // Assuming who created.  Make sure req.user is populated
    };
    const meeting = await meetingService.createMeeting(meetingData);
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

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (classId) filter.classId = classId;
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const meetings = await meetingService.getMeetings(filter);
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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const meeting = await meetingService.joinMeeting(meetingId, userId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }
    const io = getIO();
    io.to(`meeting_${meeting._id}`).emit("user_joined", { userId, timestamp: new Date() });

    res.json(meeting);
  } catch (error) {
    if (error.message === "Meeting is full.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

exports.leaveMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.body; //  userId từ body
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

exports.getMeetingsByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const meetings = await meetingService.getMeetingsByTutor(tutorId);
    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error in getMeetingsByTutor:', error);
    res.status(500).json({ message: 'Error fetching meetings', error: error.message });
  }
};

exports.cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const meeting = await meetingService.cancelMeeting(meetingId, userId, reason);
    res.status(200).json({ message: 'Meeting cancelled successfully', meeting });
  } catch (error) {
    console.error('Error in cancelMeeting:', error);
    res.status(500).json({ message: 'Error cancelling meeting', error: error.message });
  }
};
