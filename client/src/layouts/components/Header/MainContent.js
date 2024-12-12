import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import images from '../../../assets/images';
import Sidebar from './Sidebar';
import { useState } from 'react';

const MainContent = () => {
    const [collapsedSidebar, setCollapsedSidebar] = useState(true);

    return (
        <>
            <div className="main-header-area">
                <div className="container">
                    <div className="main-navbar">
                        <Link to="/" className="brand">
                            <img src={images.logo} alt="logo" />
                        </Link>

                        <div className="main-navbar-nav">
                            <Link to="/" className="item">
                                Trang chủ
                            </Link>
                            <Link to="/rooms/1" className="item">
                                Phòng
                            </Link>
                            <Link to="/dat-dich-vu" className="item">
                                Đặt dịch vụ
                            </Link>
                        </div>
                        <div className="book-now">
                            <Link to="/rooms/1">
                                Đặt phòng ngay <BsArrowRight />
                            </Link>
                        </div>

                        <div className="sidebar-toggle" onClick={() => setCollapsedSidebar((prevState) => !prevState)}>
                            {collapsedSidebar ? <FaBars /> : <GrClose />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="nav-sidebar">
                <Sidebar collapsed={collapsedSidebar} setCollapsed={setCollapsedSidebar} />
            </div>
        </>
    );
};

export default MainContent;
