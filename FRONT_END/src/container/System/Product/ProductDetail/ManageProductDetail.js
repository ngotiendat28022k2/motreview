import React from "react";
import { useEffect, useState } from "react";
import {
  getAllProductDetailByIdService,
  DeleteProductDetailService,
} from "../../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import { PAGINATION } from "../../../../utils/constant";
import ReactPaginate from "react-paginate";
import CommonUtils from "../../../../utils/CommonUtils";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
} from "react-router-dom";

const ManageProductDetail = () => {
  const { id } = useParams();
  const [dataProductDetail, setdataProductDetail] = useState([]);
  const [count, setCount] = useState("");
  const [numberPage, setnumberPage] = useState("");
  useEffect(() => {
    let fetchProductDetail = async () => {
      await loadProductDetail();
    };
    fetchProductDetail();
  }, []);
  let loadProductDetail = async () => {
    let arrData = await getAllProductDetailByIdService({
      id: id,
      limit: PAGINATION.pagerow,
      offset: 0,
    });
    if (arrData && arrData.errCode === 0) {
      setdataProductDetail(arrData.data);
      setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
    }
  };
  let handleDeleteProductDetail = async (productdetailId) => {
    let response = await DeleteProductDetailService({
      data: {
        id: productdetailId,
      },
    });
    if (response && response.errCode === 0) {
      toast.success("Xóa chi tiết sản phẩm thành công !");

      let arrData = await getAllProductDetailByIdService({
        id: id,
        limit: PAGINATION.pagerow,
        offset: numberPage * PAGINATION.pagerow,
      });
      if (arrData && arrData.errCode === 0) {
        setdataProductDetail(arrData.data);
        setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
      }
    } else {
      toast.error("Xóa sản phẩm thất bại");
    }
  };
  let handleChangePage = async (number) => {
    setnumberPage(number.selected);
    let arrData = await getAllProductDetailByIdService({
      id: id,
      limit: PAGINATION.pagerow,
      offset: number.selected * PAGINATION.pagerow,
    });
    if (arrData && arrData.errCode === 0) {
      setdataProductDetail(arrData.data);
    }
  };
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1" />
          Danh sách chi tiết sản phẩm
          <div className="float-right">
            <Link to={`/admin/add-product-detail/${id}`}>
              <i
                style={{
                  fontSize: "35px",
                  cursor: "pointer",
                  color: "#0D6EFD",
                }}
                className="fas fa-plus-square"
              ></i>
            </Link>
          </div>
        </div>
        <div className="card-body">
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
                  <th>Tên loại sản phẩm</th>
                  <th>Giá sale</th>
                  <th>Giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {dataProductDetail &&
                  dataProductDetail.length > 0 &&
                  dataProductDetail.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nameDetail}</td>
                        <td>
                          {CommonUtils.formatter.format(item.originalPrice)}
                        </td>
                        <td>
                          {CommonUtils.formatter.format(item.discountPrice)}
                        </td>
                        <td>
                          <Link
                            to={`/admin/list-product-detail-image/${item.id}`}
                          >
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
                          <Link to={`/admin/update-product-detail/${item.id}`}>
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
                          <span
                            onClick={() => handleDeleteProductDetail(item.id)}
                            style={{ color: "#0E6DFE", cursor: "pointer" }}
                          >
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
                              class="feather text-danger feather-trash-2 icon-xs"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </span>
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
export default ManageProductDetail;
