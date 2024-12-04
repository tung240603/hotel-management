import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
        },
        maxCount: {
            type: Number,
            required: true,
        },
        imageUrls: [],
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        rentperDate: {
            type: Date,
        },
        checkOutDate: {
            type: Date,
        },
        currentBookings: [
            {
                bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'booking' },
                checkInDate: Date,
                checkOutDate: Date,
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        note: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Rooms = mongoose.model('rooms', roomSchema);

export default Rooms;
