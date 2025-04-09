const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meeting.controller');
const { authenticate, isAdmin, isTutor } = require('../middlewares/auth');

// Meeting management
router.post('/create-meeting',authenticate, meetingController.createMeeting);
router.get('/get-meetings', authenticate, meetingController.getMeetings);
router.get('/get-meeting/:meetingId', meetingController.getMeetingById);
router.put('/update-meeting/:meetingId', authenticate, meetingController.updateMeeting);
router.delete('/delete-meeting/:meetingId', authenticate, meetingController.deleteMeeting);

// Meeting participation
router.post('/join-meetin/:meetingId', meetingController.joinMeeting);
router.post('/leave-meeting/:meetingId/leave', meetingController.leaveMeeting);
router.get('/getmeetingparti/:meetingId/participants', authenticate, meetingController.getMeetingParticipants);

// Meeting feedback
router.post('/:meetingId/feedback', meetingController.submitFeedback);
router.get('/:meetingId/feedback', meetingController.getMeetingFeedback);

// Meeting recording
router.post('/:meetingId/recording/start', meetingController.startRecording);
router.post('/:meetingId/recording/stop', meetingController.stopRecording);
router.get('/:meetingId/recordings', meetingController.getMeetingRecordings);

// Meeting schedule
router.get('/get-schedule', meetingController.getMeetingSchedule);
router.get('/upcoming', meetingController.getUpcomingMeetings);

module.exports = router;
