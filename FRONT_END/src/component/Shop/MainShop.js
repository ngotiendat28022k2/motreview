import React, { useState, useEffect } from "react";
import ItemProduct from "../Product/ItemProduct";
import { getAllProductUser } from "../../services/userService";
import { PAGINATION } from "../../utils/constant";
import ReactPaginate from "react-paginate";
import FormSearch from "../Search/FormSearch";
import "./ProductShop.scss";

function MainShop(props) {
  const [dataProduct, setDataProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [limitPage, setLimitPage] = useState(PAGINATION.pagerow);
  const [sortPrice, setSortPrice] = useState("");
  const [sortName, setSortName] = useState("");
  const [offset, setOffset] = useState(0);
  const [categoryId, setCategoryId] = useState(props.categoryId || "");
  const [brandId, setBrandId] = useState(props.brandId || "");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
  }, [limitPage, sortName, sortPrice, offset, categoryId, keyword]);

  useEffect(() => {
    setCategoryId(props.categoryId);
    setBrandId(props.brandId);
    loadProduct(
      limitPage,
      sortName,
      sortPrice,
      offset,
      props.categoryId,
      keyword
    );
  }, [props.categoryId, props.brandId]);

  const loadProduct = async (
    limitPage,
    sortName,
    sortPrice,
    offset,
    categoryId,
    keyword
  ) => {
    try {
      const arrData = await getAllProductUser({
        sortPrice,
        sortName,
        limit: limitPage,
        offset,
        categoryId,
        brandId,
        keyword,
      });
      if (arrData && arrData.errCode === 0) {
        setDataProduct(arrData.data);
        setCount(Math.ceil(arrData.count / limitPage));
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleSelectLimitPage = (event) => {
    const value = +event.target.value;
    setLimitPage(value);
    loadProduct(value, sortName, sortPrice, offset, categoryId, keyword);
  };

  const handleChangePage = (number) => {
    const selectedPage = number.selected;
    setOffset(selectedPage * limitPage);
    loadProduct(
      limitPage,
      sortName,
      sortPrice,
      selectedPage * limitPage,
      categoryId,
      keyword
    );

    if (props.myRef.current) {
      props.myRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectSort = (event) => {
    const value = +event.target.value;
    if (value === 1) {
      setSortPrice("");
      setSortName("");
    } else if (value === 2) {
      setSortPrice(true);
      setSortName("");
    } else if (value === 3) {
      setSortPrice("");
      setSortName(true);
    }
    loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);
    loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
  };

  const handleOnchangeSearch = (keyword) => {
    if (keyword === "") {
      setKeyword(keyword);
      loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
    }
  };

  return (
    <div className="col-lg-9">
      <div className="product_top_bar">
        <div className="left_dorp">
          <select
            style={{ outline: "none" }}
            onChange={handleSelectSort}
            className="sorting"
            style={{ height: "50px", backgroundColor: "#fff" }}
          >
            <option value={1}>Sắp xếp</option>
            <option value={2}>Theo giá tiền tăng dần</option>
            <option value={3}>Theo tên </option>
          </select>
          <select
            style={{ outline: "none" }}
            onChange={handleSelectLimitPage}
            className="show"
          >
            <option value={6}>Hiển thị 6</option>
            <option value={12}>Hiển thị 12</option>
            <option value={18}>Hiển thị 18</option>
          </select>
          <div
            style={{
              display: "inline-block",
              marginLeft: "10px",
              width: "300px",
            }}
          >
            <FormSearch
              title={"tên xe "}
              handleOnchange={handleOnchangeSearch}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "10px" }} className="latest_product_inner">
        <div className="row" style={{ gap: "49px" }}>
          {dataProduct.length > 0 ? (
            dataProduct.map((item) => (
              <ItemProduct
                key={item.id}
                id={item.id}
                width={"100%"}
                height={"235px"}
                type="col-lg-4 col-md-6"
                name={item.name}
                img={item.productDetail[0].productImage[0].image}
                discountPrice={item.productDetail[0].discountPrice}
                price={item.productDetail[0].originalPrice}
              />
            ))
          ) : (
            <div className="no-products">Không có sản phẩm</div>
          )}
        </div>
      </div>
      {dataProduct.length > 0 && (
        <ReactPaginate
          previousLabel={"Quay lại"}
          nextLabel={"Tiếp"}
          breakLabel={"..."}
          pageCount={count}
          marginPagesDisplayed={3}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
          breakClassName={"page-item"}
          activeClassName={"active"}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
}

export default MainShop;
