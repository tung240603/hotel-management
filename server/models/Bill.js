import mongoose, { SchemaTypes } from 'mongoose';

const billSchema = mongoose.Schema({
    booking: {
        type: SchemaTypes.ObjectId,
        ref: 'booking',
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'users',
    },
    dateOfPayment: {
        type: Date, // Thay đổi kiểu dữ liệu thành Date
        required: true,
    },
    totalAmount: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const Bill = mongoose.model('bill', billSchema);

export default Bill;
