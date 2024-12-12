import { createSlice } from '@reduxjs/toolkit';

const initialBookingState = {
    maxPeopel: 0,
    totalCost: 0,
    price: 0,
    roomNumber: 0,
    owner: [],
    bookingInformation: {},
    status: '',
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initialBookingState,
    reducers: {
        setMaxPeople(state, action) {
            state.maxPeopel = action.payload.maxPeopel;
        },
        setOwner(state, action) {
            state.owner[0] = action.payload.owner;
        },
        setBookingInformation(state, action) {
            state.bookingInformation = action.payload.bookingInformation;
        },
        setTotalCost(state, action) {
            state.totalCost = action.payload.totalCost;
        },
        setPrice(state, action) {
            state.price = action.payload.price;
        },
        setRoomNumber(state, action) {
            state.roomNumber = action.payload.roomNumber;
        },
        setStatus(state, action) {
            // Kiểm tra action.payload.status có tồn tại và có giá trị hợp lệ hay không
            if (action.payload && typeof action.payload.status === 'string') {
                state.status = action.payload.status;
            }
        },
    },
});

export default bookingSlice;
