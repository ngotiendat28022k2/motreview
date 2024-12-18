import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemCartStart } from "../../action/ShopCartAction";
import CommonUtils from "../../utils/CommonUtils";
import "./ItemProduct.scss";
function ProductsHorizontal(props) {
    const dispatch = useDispatch();
    const handleAddToCart = () => {
        if (props.userId) {
            dispatch(addItemCartStart({
                userId: props.userId,
                productdetailsizeId: props.id,
                quantity: 1,
            }));
        } else {
            alert("Đăng nhập để thêm vào giỏ hàng");
        }
    };
    return (
        <div className={props.type}>
            <div
                style={{ cursor: "pointer", borderRadius: "22px" }}
                className="single-product rounded overflow-hidden w-300px"
            >
                <Link to={`/detail-product/${props.id}`}>
                    <div
                        style={{ width: "100%", height: "125px" }}
                        className="product-img"
                    >
                        <img className="img-fluid w-100 h-100" src={props.img} alt="" />
                    </div>
                    <div
                        style={{ width: "100%", height: "150px" }}
                        className="product-btm"
                    >
                        <a className="d-block">
                            <h4 className="font-weight-bold">{props.name}</h4>
                        </a>
                        <div className="product_price">
                            {props.price !== 0 ? (
                                <>
                                    <span
                                        className=""
                                        style={{ color: "red", marginRight: "1.5rem" }}
                                    >
                                        {CommonUtils.formatter.format(props.discountPrice)}
                                    </span>
                                    <del>{CommonUtils.formatter.format(props.price)}</del>
                                </>
                            ) : (
                                <span style={{ color: "red" }}>
                                    {CommonUtils.formatter.format(props.discountPrice)}
                                </span>
                            )}
                        </div>
                        <div className="py-2 flex justify-content-between">
                            <button class="btn btn-dark">Xem Chi tiết </button>

                            <button className="btn btn-danger"
                                onClick={handleAddToCart}
                            >Mua ngay</button>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default ProductsHorizontal;
