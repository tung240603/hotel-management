import express from 'express';
const router = express.Router();
import { getReports, createReportsModal, getReportByMonthYear } from '../controllers/ReportController.js';

router.get('/all', getReports);
router.get('/report/:month/:year', getReportByMonthYear);

router.post('/create/:month/:year', createReportsModal);

export default router;
