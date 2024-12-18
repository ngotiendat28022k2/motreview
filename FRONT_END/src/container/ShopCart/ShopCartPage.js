import React, { useEffect, useState } from "react";
import ShopCartItem from "../../component/ShopCart/ShopCartItem";
import { useSelector, useDispatch } from "react-redux";
import {
  ChooseTypeShipStart,
  getItemCartStart,
} from "../../action/ShopCartAction";
import {
  getAllTypeShip,
  getAllAddressUserByUserIdService,
  createNewAddressUserrService,
} from "../../services/userService";
import "./ShopCartPage.scss";
import VoucherModal from "./VoucherModal";
import { Link, useHistory } from "react-router-dom";
import AddressUsersModal from "./AdressUserModal";
import { toast } from "react-toastify";
import CommonUtils from "../../utils/CommonUtils";
import CheckOut from "./MenuShopCart";

function ShopCartPage(props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isOpenModalAddressUser, setisOpenModalAddressUser] = useState(false);
  const [user, setuser] = useState();
  const [typeShip, settypeShip] = useState([]);
  let dataTypeShip = useSelector((state) => state.shopcart.dataTypeShip);
  let dataCart = useSelector((state) => state.shopcart.listCartItem);
  let dataVoucher = useSelector((state) => state.shopcart.dataVoucher);
  const [priceShip, setpriceShip] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setuser(userData);
    if (userData) {
      dispatch(getItemCartStart(userData.id));
    } else {
      toast.error("Hãy đăng nhập để mua hàng");
      return;
    }

    let fetchTypeShip = async () => {
      let res = await getAllTypeShip({
        limit: "",
        offset: "",
        keyword: "",
      });
      if (res && res.errCode === 0) {
        settypeShip(res.data);
      }
    };
    fetchTypeShip();
    if (dataTypeShip && dataTypeShip.price) {
      setpriceShip(dataTypeShip.price);
    }
  }, [dispatch, dataTypeShip]);

  let price = 0;
  let closeModal = () => {
    setisOpenModal(false);
  };
  let closeModaAddressUser = () => {
    setisOpenModalAddressUser(false);
  };
  let handleOpenModal = () => {
    setisOpenModal(true);
  };
  let handleOpenAddressUserModal = async () => {
    if (user && user.id) {
      let res = await getAllAddressUserByUserIdService(user.id);
      if (res && res.errCode === 0 && res.data.length > 0) {
        history.push(`/order/${user.id}`);
      } else {
        setisOpenModalAddressUser(true);
      }
    } else {
      toast.error("Hãy đăng nhập để mua hàng");
    }
  };
  let totalPriceDiscount = (price, discount) => {
    if (
      discount.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent"
    ) {
      if (
        (price * discount.voucherData.typeVoucherOfVoucherData.value) / 100 >
        discount.voucherData.typeVoucherOfVoucherData.maxValue
      ) {
        return price - discount.voucherData.typeVoucherOfVoucherData.maxValue;
      } else {
        return (
          price -
          (price * discount.voucherData.typeVoucherOfVoucherData.value) / 100
        );
      }
    } else {
      return price - discount.voucherData.typeVoucherOfVoucherData.maxValue;
    }
  };

  let sendDataFromModalAddress = async (data) => {
    setisOpenModalAddressUser(false);

    let res = await createNewAddressUserrService({
      shipName: data?.shipName,
      shipAdress: data.shipAdress,
      shipEmail: data.shipEmail,
      shipPhonenumber: data.shipPhonenumber,
      userId: user.id,
    });
    if (res && res.errCode === 0) {
      toast.success("Thêm địa chỉ thành công !");
      history.push(`/order/${user.id}`);
    } else {
      toast.error(res.errMessage);
    }
  };
  let closeModalFromVoucherItem = () => {
    setisOpenModal(false);
  };
  let hanldeOnChangeTypeShip = (item) => {
    setpriceShip(item.price);
    dispatch(ChooseTypeShipStart(item));
  };

  return (
    <section className="cart_area">
      <CheckOut />
      <div className="container">
        <div className="cart_inner">
          {dataCart.length === 0 ? (
            <div className="empty-cart">
              <h3>Giỏ hàng trống</h3>
              <p>Hiện tại giỏ hàng của bạn không có sản phẩm nào.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sản phẩm</th>
                      <th scope="col">Giá</th>
                      <th style={{ textAlign: "center" }} scope="col">
                        Số lượng
                      </th>
                      <th style={{ textAlign: "center" }} scope="col">
                        Tổng tiền
                      </th>
                      <th scope="col">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCart.map((item, index) => {
                      price += item.quantity * item.productDetail.discountPrice;

                      let name = `${item.productData.name} - ${item.productDetail.nameDetail} - ${item.productdetailsizeData.sizeData.value}`;
                      return (
                        <ShopCartItem
                          isOrder={false}
                          id={item.id}
                          userId={user && user.id}
                          productdetailsizeId={item.productdetailsizeData.id}
                          key={index}
                          name={name}
                          price={item.productDetail.discountPrice}
                          quantity={item.quantity}
                          image={item.productDetailImage[0].image}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="box-shopcart-bottom">
                <div className="content-left"></div>
                <div className="content-right">
                  <div className="wrap-price">
                    <span className="text-total">
                      Tổng thanh toán ({dataCart.length} sản phẩm):{" "}
                    </span>
                    <span className="text-price">
                      {dataVoucher && dataVoucher.voucherData
                        ? CommonUtils.formatter.format(
                            totalPriceDiscount(price, dataVoucher) + priceShip
                          )
                        : CommonUtils.formatter.format(price + +priceShip)}
                    </span>
                  </div>

                  <div className="">
                    <Link
                      onClick={handleOpenAddressUserModal}
                      className="main_btn"
                    >
                      Đi đến thanh toán
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <VoucherModal
        closeModalFromVoucherItem={closeModalFromVoucherItem}
        price={price + +priceShip}
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        id={user && user.id}
      />
      <AddressUsersModal
        sendDataFromModalAddress={sendDataFromModalAddress}
        isOpenModal={isOpenModalAddressUser}
        closeModaAddressUser={closeModaAddressUser}
      />
    </section>
  );
}

export default ShopCartPage;
