import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemCartStart } from "../../action/ShopCartAction";
import CommonUtils from "../../utils/CommonUtils";
import "./ItemProduct.scss";
function ItemProduct(props) {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    // const userData = JSON.parse(localStorage.getItem("userData"));
    // if (userData) {
    //   dispatch(
    //     addItemCartStart({
    //       userId: userData.userId,
    //       productdetailsizeId: userData.id,
    //       quantity: 1,
    //     })
    //   );
    // } else {
    //   alert("Đăng nhập để thêm vào giỏ hàng");
    // }
  };
  return (
    <div className={props.type}>
      <div
        style={{ cursor: "pointer", borderRadius: "22px", textAlign: "center" }}
        className="single-product rounded overflow-hidden w-300px"
      >
        <Link to={`/detail-product/${props.id}`}>
          <div
            style={{
              width: props.width,
              width: props.height,
              paddingTop: "4px",
              margin: "auto",
            }}
            className="product-img"
          >
            <img
              className="img-fluid"
              style={{ width: "235px", height: "345px", margin: "auto" }}
              src={props.img}
              alt=""
            />
          </div>
          <div style={{ width: "100%" }} className="product-btm">
            {/* <a className="d-block">
              <h4 className="font-weight-bold">{props.name}</h4>
            </a> */}
            {/* <div className="product_price">
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
            </div> */}
            <div className="py-2 ">
              <button style={{ width: "100%" }} class="btn w-100 btn-dark">
                Xem Chi tiết{" "}
              </button>

              {/* <button
                style={{ width: "40%" }}
                className="btn btn-danger"
                onClick={handleAddToCart}
              >
                Mua ngay
              </button> */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ItemProduct;
