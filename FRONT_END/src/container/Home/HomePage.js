import React, { useState, useEffect, useRef } from "react";
import HomeBanner from "../../component/HomeFeature/HomeBanner";
import ProductShop from "../../component/Shop/ProductShop";
import HomeBlog from "../../component/HomeFeature/HomeBlog";
import {
  getAllBanner,
  getProductFeatureService,
  getProductNewService,
  getNewBlog,
  getProductRecommendService,
} from "../../services/userService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HorizontalCategory from "../../component/HomeFeature/HorizontalCategory";
import ProductFeature from "../../component/HomeFeature/ProductFeature";

function HomePage(props) {
  const [dataProductFeature, setDataProductFeature] = useState([]);
  const [dataNewProductFeature, setNewProductFeature] = useState([]);
  const [dataNewBlog, setdataNewBlog] = useState([]);
  const [dataBanner, setdataBanner] = useState([]);
  const [dataProductRecommend, setdataProductRecommend] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setbrandId] = useState("");
  const myRef = useRef(null);

  let settings = {
    dots: false,
    Infinity: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    autoplay: true,
    cssEase: "linear",
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      fetchProductRecommend(userData.id);
    }
    fetchBlogFeature();
    fetchDataBrand();
    fetchProductFeature();
    fetchProductNew();

    window.scrollTo(0, 0);
  }, []);

  let fetchBlogFeature = async () => {
    let res = await getNewBlog(8);
    console.log("res", res);
    if (res && res.errCode === 0) {
      setdataNewBlog(res.data);
    }
  };

  let fetchProductFeature = async () => {
    let res = await getProductFeatureService(6);
    if (res && res.errCode === 0) {
      setDataProductFeature(res.data);
    }
  };

  let fetchProductRecommend = async (userId) => {
    let res = await getProductRecommendService({
      limit: 20,
      userId: userId,
    });
    if (res && res.errCode === 0) {
      setdataProductRecommend(res.data);
    }
  };

  let fetchDataBrand = async () => {
    let res = await getAllBanner({
      limit: 6,
      offset: 0,
      keyword: "",
    });
    if (res && res.errCode === 0) {
      setdataBanner(res.data);
    }
  };

  let fetchProductNew = async () => {
    let res = await getProductNewService(8);
    if (res && res.errCode === 0) {
      setNewProductFeature(res.data);
    }
  };

  const handleRecevieDataCategory = (code) => {
    setCategoryId(code);
    fetchProductFeature(code);
  };

  return (
    <div>
      <div
        className="container-slider"
        style={{ overflow: "hidden", marginBottom: "30px" }}
      >
        <Slider {...settings}>
          {dataBanner &&
            dataBanner.length > 0 &&
            dataBanner.map((item, index) => {
              return (
                <HomeBanner
                  description={item.description}
                  image={item.image}
                  name={item.name}
                ></HomeBanner>
              );
            })}
        </Slider>
      </div>

      <HorizontalCategory
        handleRecevieDataCategory={handleRecevieDataCategory}
      />
      <ProductShop categoryId={categoryId} brandId={brandId} myRef={myRef} />
      <HomeBlog data={dataNewBlog} />
    </div>
  );
}

export default HomePage;
