import moment from 'moment';
import Bill from '../models/Bill';
import Report from '../models/Report';
import Room from '../models/Room';
import Booking from '../models/Booking';

const createReportsModal = async (req, res) => {
    const { month, year } = req.params;

    try {
        if (!month || !year) throw new Error('Missing month or year parameter');

        // Tạo ngày bắt đầu và ngày kết thúc của tháng
        const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').toDate();
        const endOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').toDate();

        // Lấy tất cả các bill trong khoảng thời gian này
        const bills = await Bill.find({
            dateOfPayment: { $gte: startOfMonth, $lte: endOfMonth },
        }).populate({
            path: 'booking',
            select: 'room totalAmount', // Lấy thông tin phòng và tổng tiền từ booking
            populate: {
                path: 'room', // Lấy thông tin loại phòng từ room
                select: 'type',
            },
        });

        if (!bills.length) {
            return res.status(404).json({
                success: false,
                message: 'No bills found for the given month and year.',
            });
        }

        // Tính tổng doanh thu và doanh thu theo loại phòng
        let totalRevenue = 0;
        let revenueByRoomType = {}; // Lưu doanh thu theo loại phòng

        bills.forEach((bill) => {
            const booking = bill.booking;
            const roomType = booking.room ? booking.room.type : 'Unknown'; // Lấy loại phòng từ room
            const amount = parseFloat(booking.totalAmount);

            totalRevenue += amount;

            // Cộng doanh thu vào loại phòng tương ứng
            if (revenueByRoomType[roomType]) {
                revenueByRoomType[roomType] += amount;
            } else {
                revenueByRoomType[roomType] = amount;
            }
        });

        // Tính tỷ lệ doanh thu của từng loại phòng
        let details = [];
        for (let roomType in revenueByRoomType) {
            const roomRevenue = revenueByRoomType[roomType];
            const percentage = ((roomRevenue / totalRevenue) * 100).toFixed(2); // Tính tỷ lệ phần trăm

            details.push({
                roomType,
                revenue: roomRevenue,
                percentage: `${percentage}%`,
            });
        }

        // Kiểm tra nếu báo cáo cho tháng và năm này đã tồn tại
        const existingReport = await Report.findOne({ month, year });

        if (existingReport) {
            existingReport.totalRevenue = totalRevenue;
            existingReport.details = details;
            await existingReport.save();

            return res.status(200).json({
                success: true,
                message: 'Update report successfully',
                data: existingReport,
            });
        }

        // Nếu báo cáo chưa tồn tại, tạo mới
        const newReport = new Report({
            month,
            year,
            totalRevenue,
            details,
        });

        await newReport.save();

        return res.status(200).json({
            success: true,
            message: 'Create report successfully',
            data: newReport,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
        });
    }
};

const getReports = async (req, res) => {
    try {
        // Xử lý logic để lấy danh sách báo cáo
        const reports = await Report.find(); // Giả sử bạn có model Report
        return res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Controller để lấy báo cáo theo tháng và năm
export const getReportByMonthYear = async (req, res) => {
    const { month, year } = req.params; // Lấy tham số month và year từ URL

    try {
        // Tìm báo cáo trong MongoDB theo tháng và năm
        const report = await Report.findOne({ month: parseInt(month), year: parseInt(year) });

        // Nếu không tìm thấy báo cáo, trả về lỗi
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found for the given month and year.',
            });
        }

        // Trả về dữ liệu báo cáo nếu tìm thấy
        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (err) {
        // Nếu có lỗi trong quá trình truy vấn, trả về lỗi server
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
        });
    }
};

export { getReports };

export { createReportsModal };
