import express from 'express';
import { createPayment, ipnapi, handlePaymentCallback, paymentSuccess } from '../controllers/ThanhToan.js';

const router = express.Router();

// Route tạo yêu cầu thanh toán
router.post('/create', createPayment);

// Route xử lý IPN (Instant Payment Notification) từ MoMo
router.post('/callback', ipnapi);
router.get('/databack', handlePaymentCallback);
router.get('/payment-success', paymentSuccess);

export default router;
