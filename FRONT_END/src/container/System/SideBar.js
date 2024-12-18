import React from 'react';
import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
const SideBar = () => {
    const [user, setUser] = useState({})

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading"></div>
                        <Link to="/admin" className="nav-link">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt" /></div>
                            Trang chủ
                        </Link>

                        <div className="sb-sidenav-menu-heading">Quản lý</div>
                        {user && user.roleId === "R1" &&
                            <>
                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
                                    <Link to={'/admin/list-user'} className="nav-link" >Danh sách users</Link>

                                </div>

                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fas fa-list-ol"></i></div>

                                    <Link to={'/admin/list-category'} className="nav-link" >Danh sách danh mục</Link>
                                </div>

                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="far fa-copyright"></i></div>

                                    <Link to={'/admin/list-brand'} className="nav-link" >Danh sách nhãn hàng</Link>
                                </div>


                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tshirt"></i></div>

                                    <Link to={'/admin/list-product'} className="nav-link" >Danh sách sản phẩm</Link>
                                </div>


                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fab fa-adversal"></i></div>

                                    <Link to={'/admin/list-banner'} className="nav-link" >Danh sách băng rôn</Link>
                                </div>

                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fab fa-blogger"></i></div>

                                    <Link to={'/admin/list-subject'} className="nav-link" >Danh sách chủ đề</Link>
                                </div>

                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fas fa-feather-alt"></i></div>

                                    <Link to={'/admin/list-blog'} className="nav-link" >Danh sách bài đăng</Link>
                                </div>

                                <div className="dsach">
                                    <div className="sb-nav-link-icon"><i className="fas fa-shipping-fast"></i></div>


                                    <Link to={'/admin/list-typeship'} className="nav-link" >DS loại giao hàng</Link>
                                </div>
                                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseVoucher" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fas fa-percentage"></i></div>
                                    Quản lý voucher
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down" /></div>
                                </a>
                                <div className="collapse" id="collapseVoucher" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <div>
                                        <Link to={'/admin/list-typevoucher'} className="nav-link" >DS loại khuyến mãi</Link>
                                        <Link to={'/admin/list-voucher'} className="nav-link" >DS mã khuyến mãi</Link>
                                        <Link to={'/admin/add-typevoucher'} className="nav-link" >Thêm loại khuyến mãi</Link>
                                        <Link to={'/admin/add-voucher'} className="nav-link" >Thêm mã khuyến mãi</Link>
                                    </div>
                                </div>
                            </>
                        }


                        <div className="dsach">
                            <div className="sb-nav-link-icon"><i class="fa-solid fa-person-military-pointing"></i></div>

                            <Link to={'/admin/list-supplier'} className="nav-link" >Danh sách NCC</Link>
                        </div>

                        <div className="dsach">
                            <div className="sb-nav-link-icon"><i class="fa-solid fa-file-import"></i></div>

                            <Link to={'/admin/list-receipt'} className="nav-link" >Danh sách nhập hàng</Link>
                        </div>

                        <div className="dsach">
                            <div className="sb-nav-link-icon"><i className="fas fa-cart-plus"></i></div>

                            <Link to={'/admin/list-order'} className="nav-link" >Danh sách đơn hàng</Link>

                        </div>

                        <div>

                            <Link to={'/admin/chat'} className="nav-link" >Messenger</Link>

                        </div>
                        {user && user.roleId === "R1" &&
                            <>
                                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseStatistic" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
                                    Thống kê
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down" /></div>
                                </a>

                                <div className="collapse" id="collapseStatistic" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link to={'/admin/turnover'} className="nav-link" >Thống kê doanh thu</Link>

                                        <Link to={'/admin/profit'} className="nav-link" >Thống kê lợi nhuận</Link>
                                        <Link to={'/admin/stock-product'} className="nav-link" >Thống kê tồn kho</Link>

                                    </nav>
                                </div>
                            </>

                        }


                    </div>
                </div >
                <div className="sb-sidenav-footer">

                    Trang quản trị
                </div>
            </nav >
        </div >
    )
}
export default SideBar;