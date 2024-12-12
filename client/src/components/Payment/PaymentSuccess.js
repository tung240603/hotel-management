import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    // Lấy các tham số từ URL
    const partnerCode = searchParams.get('partnerCode');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const orderInfo = decodeURIComponent(searchParams.get('orderInfo') || '');
    const transId = searchParams.get('transId');
    const resultCode = searchParams.get('resultCode');
    const message = searchParams.get('message');
    const payType = searchParams.get('payType');

    const isSuccess = resultCode === '0';

    return (
        <div className="payment-success-container">
            <h1>{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</h1>
            <div className={`status-box ${isSuccess ? 'success' : 'failed'}`}>
                <p>
                    <strong>Message:</strong> {message}
                </p>
                {isSuccess && (
                    <>
                        <p>
                            <strong>Partner Code:</strong> {partnerCode}
                        </p>
                        <p>
                            <strong>Order ID:</strong> {orderId}
                        </p>
                        <p>
                            <strong>Transaction ID:</strong> {transId}
                        </p>
                        <p>
                            <strong>Amount:</strong> {amount} VND
                        </p>
                        <p>
                            <strong>Order Info:</strong> {orderInfo}
                        </p>
                        <p>
                            <strong>Payment Type:</strong> {payType}
                        </p>
                    </>
                )}
            </div>
            <button onClick={() => (window.location.href = '/')} className="back-btn">
                Go to Homepage
            </button>
        </div>
    );
};

export default PaymentSuccess;
