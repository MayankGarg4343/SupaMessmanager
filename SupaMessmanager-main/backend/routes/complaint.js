const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getStudentComplaints, updateComplaintStatus } = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/student/:studentId', getStudentComplaints);
router.put('/:id', updateComplaintStatus);

module.exports = router;
