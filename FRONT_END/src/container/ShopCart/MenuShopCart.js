import React from 'react';
import { Link } from 'react-router-dom';
import './CheckOut.scss';

const CheckOut = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : "";

    return (
        <div className="checkout-container">
            <div className="checkout-header bg-light">
                {/*========================= CHECKOUT =================*/}
                <ul className="checkout-steps d-flex justify-content-center align-items-center">
                    <li>
                        <Link className="checkout-link d-flex align-items-center" to={`/shopcart`}>
                            <i className="bi bi-check2-circle checkout-icon"></i>
                            <span className="d-none d-sm-block font-weight-medium">Giỏ hàng</span>
                        </Link>
                    </li>
                    <li>
                        <i className="bi bi-dash checkout-divider"></i>
                    </li>
                    <li>
                        <Link className="checkout-link d-flex align-items-center" to={`/shopcart`}>
                            <i class="bi bi-cart checkout-icon"></i>
                            <span className="font-weight-medium">Thanh toán</span>
                        </Link>
                    </li>
                    <li>
                        <i className="bi bi-dash checkout-divider"></i>
                    </li>
                    <li>
                        <Link className="checkout-link d-flex align-items-center" to={`/user/order/${userData?.id}`}>
                            <i class="bi bi-bag checkout-icon"></i>
                            <span className="font-weight-medium">Đơn hàng</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CheckOut;
