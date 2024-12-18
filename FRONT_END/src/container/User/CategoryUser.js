import React, { useState } from 'react';
import { Link } from "react-router-dom";
import orderLogo from '../../../src/resources/img/orderLogo.png';
import storeVoucherLogo from '../../../src/resources/img/storeVoucher.png';
import './CategoryUser.scss';

function CategoryUser(props) {
    const [openCategory, setOpenCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setOpenCategory((prev) => (prev === category ? null : category));
    };

    return (
        <div className="col-md-3">
            <ul className="list-category">
                <li className="header">Danh mục</li>
                <li className="list-item">
                    <div className='flex align-item-center'>
                        <div><i className="far fa-user icon"></i></div>
                        <Link
                            to={`/user/detail/${props.id}`}
                            onClick={() => handleCategoryClick('account')}
                            className={`link ${openCategory === 'account' ? 'active' : ''}`}
                        >
                            Tài khoản của tôi
                        </Link>
                    </div>
                    <ul className={`sublist ${openCategory === 'account' ? 'show' : ''}`}>
                        <li className="sublist-item"><Link to={`/user/detail/${props.id}`} className="sublist-link">Hồ sơ</Link></li>
                        <li className="sublist-item"><Link to={`/user/address/${props.id}`} className="sublist-link">Địa chỉ</Link></li>
                        <li className="sublist-item"><Link to={`/user/changepassword/${props.id}`} className="sublist-link">Đổi mật khẩu</Link></li>
                    </ul>
                </li>
                <li className="list-item">
                    <div className='flex align-item-center'>

                        <img src={orderLogo} alt="Order Logo" className="img" />
                        <Link to={`/user/order/${props.id}`} className="link">Đơn mua</Link>
                    </div>
                </li>
                <li className="list-item">
                    <div className='flex align-item-center'>

                        <img src={storeVoucherLogo} alt="Store Voucher Logo" className="img" />
                        <Link to={`/user/store-voucher/${props.id}`} className="link">Kho voucher</Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default CategoryUser;
