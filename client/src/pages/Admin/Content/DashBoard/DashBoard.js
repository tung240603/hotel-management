import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { BsSortDown, BsSortDownAlt } from 'react-icons/bs';

function RevenueDashboard() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [data, setData] = useState({});
    const [sort, setSort] = useState('desc');
    const [isLoading, setIsLoading] = useState(false);

    // Handle change for month and year inputs

    // Fetch report data after POST
    const handleSearch = async () => {
        setIsLoading(true);

        try {
            // Gửi yêu cầu POST để tạo báo cáo
            await axios.post(`http://localhost:5000/api/report/create/${month}/${year}`);

            // Gửi yêu cầu GET để lấy báo cáo đã tạo
            const response = await axios.get(`http://localhost:5000/api/report/report/${month}/${year}`);
            const reportData = response.data.data; // Lấy data từ response

            if (reportData && !_.isEmpty(reportData)) {
                const sortedReport = _.orderBy(reportData.details, ['revenue'], [sort]); // Sắp xếp theo doanh thu
                setData({
                    month: reportData.month,
                    year: reportData.year,
                    totalRevenue: reportData.totalRevenue,
                    details: sortedReport, // Lưu thông tin chi tiết vào state
                });
            } else {
                setData({}); // Xử lý khi không có dữ liệu
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            setData({}); // Xử lý lỗi
        } finally {
            setIsLoading(false);
        }
    };

    // Handle sorting
    const handleSort = () => {
        const newSort = sort === 'desc' ? 'asc' : 'desc';
        setSort(newSort);
    };

    return (
        <div>
            <div className="d-flex mb-4">
                <div>
                    <label htmlFor="month">Chọn tháng:</label>
                    <input
                        type="month"
                        id="month"
                        value={`${year}-${month}`}
                        onChange={(e) => {
                            const [selectedYear, selectedMonth] = e.target.value.split('-');
                            setYear(selectedYear);
                            setMonth(selectedMonth);
                        }}
                    />
                </div>
                <button className="btn btn-primary ml-2" style={{ marginLeft: '30px' }} onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>

            <div className="admin-revenue-container mt-5">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr className="table-dark">
                            <th scope="col" colSpan="5" className="text-center">
                                Báo Cáo Doanh Thu Theo Loại Phòng
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className="text-center" colSpan="5">
                                {_.isEmpty(data) ? 'Tháng ...' : `Tháng ${data.month}/${data.year}`}
                            </th>
                        </tr>
                        <tr className="table-dark">
                            <th scope="col" className="text-center">
                                STT
                            </th>
                            <th scope="col" className="text-center">
                                Loại Phòng
                            </th>
                            <th scope="col" className="text-center">
                                Doanh Thu (VND)
                            </th>
                            <th scope="col" className="text-center">
                                <div className="d-flex align-items-center justify-content-center">
                                    Tỷ Lệ
                                    <div className="sort-container" onClick={handleSort}>
                                        {sort === 'desc' ? <BsSortDown /> : <BsSortDownAlt />}
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!_.isEmpty(data) && !isLoading ? (
                            data.details.map((item, index) => (
                                <tr key={index}>
                                    <th className="text-center" scope="row">
                                        {index + 1}
                                    </th>
                                    <td className="text-center">{item.roomType}</td>
                                    <td className="text-center">{item.revenue} VND</td>
                                    <td className="text-center">
                                        {data.totalRevenue !== 0
                                            ? ((item.revenue / data.totalRevenue) * 100).toFixed(2) + '%'
                                            : '0%'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <th colSpan="4" className="text-center">
                                    {isLoading ? (
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'KHÔNG CÓ DỮ LIỆU'
                                    )}
                                </th>
                            </tr>
                        )}

                        {/* Dòng tổng doanh thu */}
                        {!_.isEmpty(data) && !isLoading && (
                            <tr className="table-info">
                                <th colSpan="2" className="text-center">
                                    Tổng Doanh Thu
                                </th>
                                <td colSpan="2" className="text-center">
                                    {data.totalRevenue.toLocaleString()} VND
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RevenueDashboard;
