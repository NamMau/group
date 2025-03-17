const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');
const { auth, isTutorOrAdmin, isOwnerOrAdmin } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(auth);

// Meeting management
router.post('/', isTutorOrAdmin, meetingController.createMeeting);
router.get('/', meetingController.getMeetings);
router.get('/:meetingId', meetingController.getMeetingById);
router.put('/:meetingId', isOwnerOrAdmin, meetingController.updateMeeting);
router.delete('/:meetingId', isOwnerOrAdmin, meetingController.deleteMeeting);

// Meeting participation
router.post('/:meetingId/join', meetingController.joinMeeting);
router.post('/:meetingId/leave', meetingController.leaveMeeting);
router.get('/:meetingId/participants', meetingController.getMeetingParticipants);

// Meeting feedback
router.post('/:meetingId/feedback', meetingController.submitFeedback);
router.get('/:meetingId/feedback', meetingController.getMeetingFeedback);

// Meeting recording
router.post('/:meetingId/recording/start', isTutorOrAdmin, meetingController.startRecording);
router.post('/:meetingId/recording/stop', isTutorOrAdmin, meetingController.stopRecording);
router.get('/:meetingId/recordings', meetingController.getMeetingRecordings);

// Meeting schedule
router.get('/schedule', meetingController.getMeetingSchedule);
router.get('/upcoming', meetingController.getUpcomingMeetings);

module.exports = router;
