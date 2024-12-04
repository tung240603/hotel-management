import express from 'express';

const router = express.Router();
const { upload } = require('../helpers/FileHelper.js');

import {
    getAllRooms,
    getAllRoomsWithPagination,
    getRoomsFilter,
    getAllRoomsByType,
    getAllRoomsByTypeName,
    getRoomById,
    createRoom,
    updateRoomWithBookingDetails,
    deleteRoom,
    checkOutRoom,
} from '../controllers/RoomsController.js';

router.get('/all', getAllRooms);

router.get('/all/:page', getAllRoomsWithPagination);

router.post('/filter/:page', getRoomsFilter);

router.get('/all/type/:id', getAllRoomsByType);

router.get('/all/type/name/:name', getAllRoomsByTypeName);

router.get('/:id', getRoomById);

router.post('/createRoom', upload.array('images'), createRoom);

router.put('/updateRoom/:id', upload.array('images'), updateRoomWithBookingDetails);

router.delete('/deleteRoom/:id', deleteRoom);

router.put('/checkOut/:bookingId', checkOutRoom);

export default router;
