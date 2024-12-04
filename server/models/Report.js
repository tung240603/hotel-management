import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
    {
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        totalRevenue: {
            type: Number,
            required: true,
        },
        details: [
            {
                roomType: { type: String, required: true }, // Loại phòng
                revenue: { type: Number, required: true }, // Doanh thu
                percentage: { type: String, required: true }, // Tỷ lệ doanh thu
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
