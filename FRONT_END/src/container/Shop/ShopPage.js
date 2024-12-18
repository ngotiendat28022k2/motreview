import React, { useState, useRef, useEffect } from "react";
import MainShop from "../../component/Shop/MainShop";
import Category from "../../component/Shop/Category";
import Brand from "../../component/Shop/Brand";

function ShopPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [categoryId, setcategoryId] = useState("ALL");
  const [brandId, setbrandId] = useState("ALL");
  const myRef = useRef(null);

  let handleRecevieDataCategory = (code) => {
    setcategoryId(code);
  };

  // let handleRecevieDataBrand = (code) => {
  //   setbrandId(code);
  // };

  return (
    <div>
      <section className="mt-3 mb-5">
        <hr />
      </section>
      <section className="cat_product_area">
        <div className="container">
          <div className="row flex-row-reverse">
            <MainShop categoryId={categoryId} brandId={brandId} myRef={myRef} />
            <div className="col-lg-3">
              <div className="left_sidebar_area">
                <Category
                  handleRecevieDataCategory={handleRecevieDataCategory}
                />
                {/* <Brand handleRecevieDataBrand={handleRecevieDataBrand} /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
