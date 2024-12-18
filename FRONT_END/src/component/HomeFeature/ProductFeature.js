import React, { useEffect, useState } from "react";
import ItemProduct from "../Product/ItemProduct";
import HeaderContent from "../Content/HeaderContent";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductFeature.scss";
import {
  getDetailProductByIdService,
  getProductFeatureService,
} from "../../services/userService";

function ProductFeature(props, title) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);

  console.log("data", data);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProductFeatureService();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching product feature data", error);
      }
    }
    fetchData();
  }, []);
  return (
    <section className="feature_product_area section_gap_bottom_custom">
      <div className="container">
        <HeaderContent mainContent={props.title} />
        <div className="row box-productFeature">
          <Slider {...settings}>
            {props.data &&
              props.data.length > 3 &&
              props.data.map((item, index) => {
                return (
                  <ItemProduct
                    userId={user && user.id ? user.id : ""}
                    id={item.id}
                    key={index}
                    width={"100%"}
                    height={250}
                    type="col-lg-12 col-md-6"
                    name={item.name}
                    img={
                      item.productDetail && item.productDetail[0]
                        ? item.productDetail[0].productImage[0].image
                        : ""
                    }
                    price={
                      item.productDetail && item.productDetail[0]
                        ? item.productDetail[0].originalPrice
                        : ""
                    }
                    discountPrice={
                      item.productDetail && item.productDetail[0]
                        ? item.productDetail[0].discountPrice
                        : ""
                    }
                  />
                );
              })}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ProductFeature;
