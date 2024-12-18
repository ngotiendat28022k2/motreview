import React, { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addItemCartStart } from "../../action/ShopCartAction";
import "./InfoDetailProduct.scss";
import CommonUtils from "../../utils/CommonUtils";
import DescriptionProduct from "./DescriptionProduct";

function InfoDetailProduct(props) {
  let { dataProduct } = props;
  let [arrDetail, setarrDetail] = useState([]);
  const [productDetail, setproductDetail] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [imgPreview, setimgPreview] = useState("");
  const [activeLinkId, setactiveLinkId] = useState("");
  const [quantity, setquantity] = useState("");
  const [quantityProduct, setquantityProduct] = useState(1);

  useEffect(() => {
    let { productDetail } = dataProduct ? dataProduct : [];
    if (productDetail) {
      setproductDetail(productDetail);
      setarrDetail(productDetail[0]);
      setactiveLinkId(productDetail[0].productDetailSize[0].id);
      setquantity(productDetail[0].productDetailSize[0].stock);
      props.sendDataFromInforDetail(productDetail[0].productDetailSize[0]);
    }
  }, [props.dataProduct]);

  let handleSelectDetail = (event) => {
    setarrDetail(productDetail[event.target.value]);
    if (
      productDetail[event.target.value] &&
      productDetail[event.target.value].productDetailSize.length > 0
    ) {
      setactiveLinkId(
        productDetail[event.target.value].productDetailSize[0].id
      );
      setquantity(productDetail[event.target.value].productDetailSize[0].stock);
      props.sendDataFromInforDetail(
        productDetail[event.target.value].productDetailSize[0]
      );
    }
  };

  let openPreviewImage = (url) => {
    console.log("url", url);
    setimgPreview(url);
    setisOpen(true);
  };

  let handleClickBoxSize = (data) => {
    setactiveLinkId(data.id);
    setquantity(data.stock);
    props.sendDataFromInforDetail(data);
  };

  const dispatch = useDispatch();

  let handleAddShopCart = () => {
    if (props.userId) {
      dispatch(
        addItemCartStart({
          userId: props.userId,
          productdetailsizeId: activeLinkId,
          quantity: quantityProduct,
        })
      );
    } else {
      toast.error("Đăng nhập để thêm vào giỏ hàng");
    }
  };

  return (
    <div className="container">
      <div className="row s_product_inner">
        <div className="col-lg-4">
          <div className="s_product_img">
            <div
              id="carouselExampleIndicators"
              className="carousel slide flex space-between item-start"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {arrDetail &&
                  arrDetail.productImage &&
                  arrDetail.productImage.length > 0 &&
                  arrDetail.productImage.map((item, index) => {
                    if (index === 0) {
                      return (
                        <div
                          onClick={() => openPreviewImage(item.image)}
                          style={{ cursor: "pointer" }}
                          className="carousel-item active"
                        >
                          <img
                            className="d-block w-100"
                            style={{ width: "400px" }}
                            src={item.image}
                            alt="Ảnh bị lỗi"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          onClick={() => openPreviewImage(item.image)}
                          style={{ cursor: "pointer" }}
                          className="carousel-item"
                        >
                          <img
                            className="d-block w-100"
                            style={{ width: "400px" }}
                            src={item.image}
                            alt="Ảnh bị lỗi"
                          />
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
            <div className="s_product_text" style={{ marginTop: "50px" }}>
              <div className="form-group">
                <select
                  onChange={(event) => handleSelectDetail(event)}
                  className="sorting"
                  name="type"
                  style={{
                    outline: "none",
                    border: "1px solid #eee",
                    width: "100%",
                    padding: "10px 5px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {dataProduct &&
                    productDetail &&
                    productDetail.length > 0 &&
                    productDetail.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item.nameDetail}
                        </option>
                      );
                    })}
                </select>
              </div>
              <h3 className="font-weight-bold">{dataProduct.name}</h3>
              {/* {arrDetail.originalPrice > 0 && (
                <h2 style={{ textDecorationLine: "line-through" }}>
                  {arrDetail.originalPrice?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h2>
              )}

              <h5>
                Giá:{" "}
                {arrDetail.discountPrice?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </h5> */}
              <ul className="list">
                <li>
                  <a className="active" href="#">
                    <span>Loại</span> :{" "}
                    {dataProduct && dataProduct.categoryData
                      ? dataProduct.categoryData.value
                      : ""}
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span style={{ marginBottom: 5 }}>Trạng thái</span> :{" "}
                    {quantity > 0 ? (
                      <span
                        style={{
                          color: "#e588a1",
                          display: "inline-block",
                          width: "130px",
                        }}
                      >
                        Còn Hàng({quantity})
                      </span>
                    ) : (
                      <span style={{ color: "red" }}>Hết Hàng</span>
                    )}
                  </a>
                </li>
                <li>
                  <div className="box-size">
                    <a href="#">
                      <span>Phần:</span>
                    </a>
                    {arrDetail &&
                      arrDetail.productDetailSize &&
                      arrDetail.productDetailSize.length > 0 &&
                      arrDetail.productDetailSize.map((item, index) => {
                        console.log("item", item);
                        return (
                          <div
                            onClick={() => handleClickBoxSize(item)}
                            key={index}
                            className={
                              item.id === activeLinkId
                                ? "product-size active"
                                : "product-size"
                            }
                            style={{
                              backgroundColor: item.sizeData.code,
                              margin: "5px",
                            }}
                          >
                            {item.sizeData.code}
                          </div>
                        );
                      })}
                  </div>
                </li>
                <li>
                  <a style={{ marginBottom: 15 }} href="#">
                    {quantity} sản phẩm có sẵn
                  </a>
                </li>
              </ul>
              <div style={{ display: "flex" }}>
                <div className="product_count">
                  <label htmlFor="qty">Số lượng</label>
                  <input
                    type="number"
                    value={quantityProduct}
                    onChange={(event) => setquantityProduct(event.target.value)}
                    min="1"
                  />
                </div>
              </div>
              <div className="card_area">
                <a
                  className="btn-productdetail"
                  onClick={() => handleAddShopCart()}
                >
                  Thêm vào giỏ
                </a>

                <a className="btn-productdetail" style={{ marginLeft: "20px" }}>
                  Muốn đọc
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 offset-lg-1 description-product">
          <DescriptionProduct data={dataProduct.contentHTML} />
        </div>
        {isOpen === true && (
          <Lightbox
            mainSrc={imgPreview}
            onCloseRequest={() => setisOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default InfoDetailProduct;
