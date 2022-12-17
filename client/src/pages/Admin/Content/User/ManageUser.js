import { useEffect, useState } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { getUsersOfPage } from '../../../../services/apiServices';
import _ from 'lodash';

import './ManageUser.scss';
import ModalDeleteUser from './ModalDeleteUser';
import ModalManageUser from './ModalManageUser';
import TableUserPaginate from './TableUserPaginate';

function ManageUser() {
    const ITEMS_PER_PAGE = 6;

    const [listUsers, setListUsers] = useState([]);

    const [isShowModalCreateUser, setIsShowModalCreateUser] = useState(false);

    const [isShowModalViewUser, setIsShowModalViewUser] = useState(false);
    const [dataUserView, setDataUserView] = useState({});

    const [isShowModalEditUser, setIsShowModalEditUser] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});

    const [isShowModalDeleteUser, setIsShowModalDeleteUser] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        fetchListUsersOfPage(1);
    }, []);

    const fetchListUsersOfPage = async (currentPage) => {
        const res = await getUsersOfPage({ page: currentPage, perPage: ITEMS_PER_PAGE });

        const data = res.data;

        if (res.status !== 200) {
            throw new Error(data.message);
        }

        setListUsers(data.results.results);
        setPageCount(Math.floor(data.lengthOfAllUsers / ITEMS_PER_PAGE) + 1);
    };

    const handleClickViewButton = (user) => {
        setDataUserView(user);
        setIsShowModalViewUser(true);
    };

    const handleClickEditButton = (user) => {
        setDataUserEdit(user);
        setIsShowModalEditUser(true);
    };

    const handleClickDeleteButton = (user) => {
        setDataUserDelete(user);
        setIsShowModalDeleteUser(true);
    };

    const handlePageClick = (currentPageClicked) => {
        setCurrentPage(currentPageClicked);
        fetchListUsersOfPage(currentPageClicked);
    };

    return (
        <div className="manage-user-container">
            <h3>Quản lý Người dùng</h3>
            <button className="btn btn-primary add-user-btn" onClick={() => setIsShowModalCreateUser(true)}>
                <BsFillPlusCircleFill />
                Thêm mới Người dùng
            </button>

            <div className="content-table">
                <TableUserPaginate
                    listUsers={listUsers}
                    handleClickViewButton={handleClickViewButton}
                    handleClickEditButton={handleClickEditButton}
                    handleClickDeleteButton={handleClickDeleteButton}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                />
            </div>

            <ModalManageUser
                modalType="CREATE"
                title="Add new user"
                show={isShowModalCreateUser}
                setShow={setIsShowModalCreateUser}
                fetchListUsersOfPage={fetchListUsersOfPage}
                setCurrentPage={setCurrentPage}
            />

            <ModalManageUser
                modalType="VIEW"
                title="User Information"
                show={isShowModalViewUser}
                setShow={setIsShowModalViewUser}
                dataUser={dataUserView}
                fetchListUsersOfPage={fetchListUsersOfPage}
                setCurrentPage={setCurrentPage}
            />

            <ModalManageUser
                modalType="EDIT"
                title="Edit user"
                show={isShowModalEditUser}
                setShow={setIsShowModalEditUser}
                dataUser={dataUserEdit}
                fetchListUsersOfPage={fetchListUsersOfPage}
                setCurrentPage={setCurrentPage}
            />

            <ModalDeleteUser
                show={isShowModalDeleteUser}
                setShow={setIsShowModalDeleteUser}
                dataUser={dataUserDelete}
                fetchListUsersOfPage={fetchListUsersOfPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

export default ManageUser;
