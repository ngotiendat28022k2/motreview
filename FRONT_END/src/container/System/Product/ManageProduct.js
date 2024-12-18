import React from "react";
import { useEffect, useState } from "react";
import {
  getAllProductAdmin,
  handleBanProductService,
  handleActiveProductService,
  DeleteProduct,
} from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import { PAGINATION } from "../../../utils/constant";
import ReactPaginate from "react-paginate";
import CommonUtils from "../../../utils/CommonUtils";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import FormSearch from "../../../component/Search/FormSearch";
const ManageProduct = () => {
  const [dataProduct, setdataProduct] = useState([]);
  const [count, setCount] = useState("");
  const [numberPage, setnumberPage] = useState("");
  const [keyword, setkeyword] = useState("");
  useEffect(() => {
    let fetchProduct = async () => {
      await loadProduct(keyword);
    };
    fetchProduct();
  }, []);
  let loadProduct = async (keyword) => {
    let arrData = await getAllProductAdmin({
      sortName: "",
      sortPrice: "",
      categoryId: "ALL",
      brandId: "ALL",
      limit: PAGINATION.pagerow,
      offset: 0,
      keyword: keyword,
    });
    if (arrData && arrData.errCode === 0) {
      setdataProduct(arrData.data);
      setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
    }
  };
  let handleBanProduct = async (id) => {
    let data = await handleBanProductService({
      id: id,
    });
    if (data && data.errCode === 0) {
      toast.success("Ẩn sản phẩm thành công!");
      let arrData = await getAllProductAdmin({
        sortName: "",
        sortPrice: "",
        categoryId: "ALL",
        brandId: "ALL",
        keyword: "",
        limit: PAGINATION.pagerow,
        offset: numberPage * PAGINATION.pagerow,
      });
      if (arrData && arrData.errCode === 0) {
        setdataProduct(arrData.data);
        setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
      }
    } else {
      toast.error("Ẩn sản phẩm thất bại!");
    }
  };
  let handleActiveProduct = async (id) => {
    let data = await handleActiveProductService({
      id: id,
    });
    if (data && data.errCode === 0) {
      toast.success("Hiện sản phẩm thành công!");
      loadProduct("");
    } else {
      toast.error("Hiện sản phẩm thất bại!");
    }
  };
  let handleChangePage = async (number) => {
    setnumberPage(number.selected);
    let arrData = await getAllProductAdmin({
      limit: PAGINATION.pagerow,
      offset: number.selected * PAGINATION.pagerow,
      sortName: "",
      sortPrice: "",
      categoryId: "ALL",
      brandId: "ALL",
      keyword: keyword,
    });
    if (arrData && arrData.errCode === 0) {
      setdataProduct(arrData.data);
    }
  };
  let handleSearchProduct = (keyword) => {
    loadProduct(keyword);
    setkeyword(keyword);
  };
  let handleOnchangeSearch = (keyword) => {
    if (keyword === "") {
      loadProduct(keyword);
      setkeyword(keyword);
    }
  };
  let handleOnClickExport = async () => {
    let res = await getAllProductAdmin({
      sortName: "",
      sortPrice: "",
      categoryId: "ALL",
      brandId: "ALL",
      keyword: "",
      limit: "",
      offset: "",
    });
    if (res && res.errCode == 0) {
      await CommonUtils.exportExcel(
        res.data,
        "Danh sách sản phẩm",
        "ListProduct"
      );
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      console.log("id", id);
      let data = await DeleteProduct(id);
      if (data && data.errCode === 0) {
        toast.success("Xóa sản phẩm thành công!");
        await loadProduct(keyword);
      } else {
        toast.error("Xóa sản phẩm thất bại!");
      }
    }
  };
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý sản phẩm</h1>

      <div className="card mb-4">
        <div className="card-header flex justify-content-between">
          <Link
            to={"/admin/add-product"}
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="bi bi-plus fs-5 me-2"></i> Thêm sản phẩm
          </Link>
          <div className="col-8">
            <button
              style={{ float: "right" }}
              onClick={() => handleOnClickExport()}
              className="btn btn-success"
            >
              Xuất excel <i class="fa-solid fa-file-excel"></i>
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-4">
              <FormSearch
                title={"tên sản phẩm"}
                handleOnchange={handleOnchangeSearch}
                handleSearch={handleSearchProduct}
              />{" "}
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-bordered"
              style={{ border: "1" }}
              width="100%"
              cellspacing="0"
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th style={{ width: "110px" }}>Danh mục</th>
                  <th style={{ width: "110px" }}>Nhãn hàng</th>
                  <th>Tác Giả</th>
                  <th>Nhà Xuất Bản</th>
                  <th style={{ width: "90px" }}>Lượt xem</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {dataProduct &&
                  dataProduct.length > 0 &&
                  dataProduct.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.categoryData.value}</td>
                        <td>{item.brandData.value}</td>
                        <td>{item.material}</td>
                        <td>{item.madeby}</td>
                        <td>{item.view ? item.view : 0}</td>
                        <td>{item.statusData.value}</td>
                        <td style={{ width: "12%", textAlign: "center" }}>
                          <Link to={`/admin/list-product-detail/${item.id}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-eye icon-xs"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </Link>
                          &nbsp; &nbsp;
                          <Link to={`/admin/edit-product/${item.id}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ color: "black" }}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-edit icon-xs"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>
                          &nbsp; &nbsp;
                          {item.statusData.code === "S1" ? (
                            <span
                              onClick={() => handleBanProduct(item.id)}
                              style={{ color: "#0E6DFE", cursor: "pointer" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-eye-off"
                              >
                                <path d="M17.94 17.94A10.05 10.05 0 0 0 12 4.5 10.05 10.05 0 0 0 6.06 6.06"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M12 16c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                              </svg>
                            </span>
                          ) : (
                            <span
                              onClick={() => handleActiveProduct(item.id)}
                              style={{ color: "#0E6DFE", cursor: "pointer" }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FF0000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-check-circle"
                              >
                                <path d="M12 20a8 8 0 1 0-8-8 8 8 0 0 0 8 8z"></path>
                                <polyline points="9 11 12 14 22 4"></polyline>
                              </svg>
                            </span>
                          )}
                          <>
                            <button
                              style={{ marginLeft: "10px" }}
                              className="btn btn-danger"
                              onClick={() => handleRemove(item.id)}
                            >
                              Xóa
                            </button>
                          </>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
    </div>
  );
};
export default ManageProduct;
