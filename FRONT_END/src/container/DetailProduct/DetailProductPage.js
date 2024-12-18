import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getDetailProductByIdService,
  getProductRecommendService,
} from "../../services/userService";
import InfoDetailProduct from "../../component/Product/InfoDetailProduct";
import ProfileProduct from "../../component/Product/ProfileProduct";
import ReviewProduct from "../../component/Product/ReviewProduct";
import DescriptionProduct from "../../component/Product/DescriptionProduct";
import ProductFeature from "../../component/HomeFeature/ProductFeature";
import GalleryPRoduct from "../../component/Product/GalleryPRoduct";
function DetailProductPage(props) {
  const [dataProduct, setDataProduct] = useState({});
  const [dataDetailSize, setdataDetailSize] = useState({});
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [dataProductRecommend, setdataProductRecommend] = useState([]);
  useEffect(async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      fetchProductFeature(userData.id);
      setUser(userData);
    }

    window.scrollTo(0, 0);

    fetchDetailProduct();
  }, []);
  let sendDataFromInforDetail = (data) => {
    setdataDetailSize(data);
  };
  let fetchDetailProduct = async () => {
    let res = await getDetailProductByIdService(id);
    if (res && res.errCode === 0) {
      setDataProduct(res.data);
    }
  };
  let fetchProductFeature = async (userId) => {
    let res = await getProductRecommendService({
      limit: 20,
      userId: userId,
    });
    if (res && res.errCode === 0) {
      setdataProductRecommend(res.data);
    }
  };
  if (
    !dataProduct ||
    !dataProduct.productDetail ||
    dataProduct.productDetail.length === 0
  ) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div>
      <section className="">
        <hr />
      </section>
      <section className="product_description_area" style={{ marginTop: "0" }}>
        <div className="container">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="productDetail-tab"
                data-toggle="tab"
                href="#productDetail"
                role="tab"
                aria-controls="productDetail"
                aria-selected="false"
              >
                Tổng quan
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link "
                id="profile-tab"
                data-toggle="tab"
                href="#profile"
                role="tab"
                aria-controls="profile"
                aria-selected="true"
              >
                Thông tin chi tiết
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link "
                id="home-tab"
                data-toggle="tab"
                href="#home"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Mô tả chi tiết
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                id="review-tab"
                data-toggle="tab"
                href="#review"
                role="tab"
                aria-controls="review"
                aria-selected="false"
              >
                Đánh giá
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="gallery-tab"
                data-toggle="tab"
                href="#gallery"
                role="tab"
                aria-controls="gallery"
                aria-selected="false"
              >
                Hình ảnh trưng bày
              </a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="productDetail"
              role="tabpanel"
              aria-labelledby="productDetail-tab"
            >
              <InfoDetailProduct
                userId={user && user.id ? user.id : ""}
                dataProduct={dataProduct}
                sendDataFromInforDetail={sendDataFromInforDetail}
              ></InfoDetailProduct>
            </div>
            <div
              className="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <ProfileProduct dataProduct={dataProduct} data={dataDetailSize} />
            </div>
            <div
              className="tab-pane fade "
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div
                className="col-lg-12  description-product"
                style={{ backgroundColor: "white", color: "black" }}
              >
                <DescriptionProduct
                  data={dataProduct.productDetail[0].contentHTML}
                />
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="review"
              role="tabpanel"
              aria-labelledby="review-tab"
            >
              <ReviewProduct />
            </div>
            <div
              className="tab-pane fade"
              id="gallery"
              role="tabpanel"
              aria-labelledby="gallery-tab"
            >
              <GalleryPRoduct
                data={dataProduct.productDetail[0].productImage}
              />
            </div>
          </div>
        </div>
        {console.log("dataProductRecommend", dataProductRecommend)}
        {dataProductRecommend.length > 3 && (
          <ProductFeature
            title={"Sản phẩm bạn quan tâm"}
            data={dataProductRecommend}
          ></ProductFeature>
        )}
      </section>
    </div>
  );
}

export default DetailProductPage;
