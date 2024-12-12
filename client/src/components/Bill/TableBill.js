import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import ReactPaginate from 'react-paginate';
import FormatPrice from '../FormatPrice/FormatPrice';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaSort } from 'react-icons/fa';
import { setSatatusBooking } from '../../services/apiServices';
function TableBill({ role, listBills, setIsShowModalViewBill, setDataBillView }) {
    const ITEMS_PER_PAGE = 6;

    const sortOptions = [
        { label: 'Tăng dần', value: 'asc' },
        { label: 'Giảm dần', value: 'desc' },
    ];

    const initSortCheckedState = sortOptions.reduce((result, sortOption) => {
        result[sortOption.value] = false;
        return { ...result };
    }, {});

    const [chunkedBills, setChunkedBills] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [sortChecked, setSortChecked] = useState(initSortCheckedState);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (listBills && listBills.length > 0) {
            setPageCount(Math.ceil(listBills.length / ITEMS_PER_PAGE));
            setChunkedBills(_.chunk(listBills, ITEMS_PER_PAGE));
        }
    }, [listBills]);

    const calcDateDiff = (startDate, endDate) => (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    const handleClickViewButton = (bill) => {
        setIsShowModalViewBill(true);
        setDataBillView(bill);
    };

    const handleStatusUpdate = async (billId, index) => {
        try {
            const response = await setSatatusBooking(`${billId}`);
            if (response.status === 200) {
                // Cập nhật trạng thái tại vị trí cụ thể trong danh sách
                setChunkedBills((prev) =>
                    prev.map((chunk, pageIndex) =>
                        pageIndex === currentPage - 1
                            ? chunk.map((bill, billIndex) => (billIndex === index ? { ...bill, status: 'Paid' } : bill))
                            : chunk,
                    ),
                );
            }
        } catch (error) {
            console.error('Cập nhật trạng thái thất bại:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái!');
        }
    };

    const handleSearchBills = () => {
        let bills = _.clone(listBills);
        if (bills.length === 0) return;

        if (searchValue) {
            bills = listBills.filter((bill) => {
                if (role === 'ADMIN' && bill?.customer?.name) {
                    return (
                        bill.roomNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                        bill.customer.name.toLowerCase().includes(searchValue.toLowerCase())
                    );
                } else {
                    return bill.roomNumber.toLowerCase().includes(searchValue.toLowerCase());
                }
            });
        }

        let allSortCheckedOrNotChecked =
            Object.keys(sortChecked).every((key) => sortChecked[key] === true) ||
            Object.keys(sortChecked).every((key) => sortChecked[key] === false);

        if (allSortCheckedOrNotChecked === true) {
            setCurrentPage(1);
            setPageCount(Math.ceil(bills.length / ITEMS_PER_PAGE));
            setChunkedBills(_.chunk(bills, ITEMS_PER_PAGE));
        } else {
            let sortValue = '';
            Object.keys(sortChecked).forEach((key) => {
                if (sortChecked[key] === true) sortValue = key;
            });

            const data = _.orderBy(bills, ['totalAmount'], [sortValue]);

            setCurrentPage(1);
            setPageCount(Math.ceil(data.length / ITEMS_PER_PAGE));
            setChunkedBills(_.chunk(data, ITEMS_PER_PAGE));
        }
    };

    const handleClearFiltered = () => {
        setSearchValue('');
        setSortChecked(initSortCheckedState);
    };

    return (
        <>
            {/* Search and Sort UI */}
            {/* ... */}
            <table className="table table-hover">
                <thead>
                    <tr className="table-dark">
                        <th scope="col">STT</th>
                        <th scope="col">Phòng</th>
                        {role === 'ADMIN' && <th scope="col">Khách Hàng</th>}
                        <th scope="col">Số Ngày Thuê</th>
                        <th scope="col">Đơn Giá</th>
                        <th scope="col">Thành Tiền</th>
                        {/* <th scope="col">Trạng thái</th> */}
                        <th scope="col">Hành động</th>
                        {/* <th scope="col">Thanh Toán</th> */}
                    </tr>
                </thead>
                <tbody>
                    {chunkedBills && chunkedBills.length > 0 ? (
                        chunkedBills[currentPage - 1].map((bill, index) => (
                            <tr key={bill._id}>
                                <th scope="row">{ITEMS_PER_PAGE * (currentPage - 1) + (index + 1)}</th>
                                <td>{bill.roomNumber}</td>
                                {role === 'ADMIN' && <td>{bill?.customer?.name}</td>}
                                <td>{calcDateDiff(new Date(bill.checkInDate), new Date(bill.checkOutDate))}</td>
                                <td>
                                    <FormatPrice>{bill.roomPrice}</FormatPrice>
                                </td>
                                <td>
                                    <FormatPrice>{bill.totalAmount}</FormatPrice>
                                </td>
                                {/* <td>{bill.status}</td> */}
                                <td>
                                    <button className="btn btn-success" onClick={() => handleClickViewButton(bill)}>
                                        Xem chi tiết
                                    </button>
                                </td>
                                {/* <td>
                                    <button
                                        type="button"
                                        className={`btn ${bill.status === 'Paid' ? 'btn-success' : 'btn-warning'}`}
                                        onClick={() => handleStatusUpdate(bill._id, index)}
                                        disabled={bill.status === 'Paid'}
                                    >
                                        {bill.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </button>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={role === 'ADMIN' ? '8' : '7'} className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination */}
            {/* ... */}
        </>
    );
}

export default TableBill;
