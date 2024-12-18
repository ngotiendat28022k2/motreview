import React, { useEffect, useState } from "react";
import {
  deleteReceiptService,
  getAllReceipt,
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

const ManageReceipt = () => {
  const [dataReceipt, setdataReceipt] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setnumberPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let arrData = await getAllReceipt({
        sort: "desc",
        sortBy: "createdAt",
        limit: PAGINATION.pagerow,
        offset: 0,
      });
      if (arrData && arrData.errCode === 0) {
        // Sắp xếp dữ liệu theo ngày gần nhất
        const sortedData = arrData.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setdataReceipt(sortedData);
        setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = async (number) => {
    setnumberPage(number.selected);
    try {
      let arrData = await getAllReceipt({
        sort: "desc",
        sortBy: "createdAt",
        limit: PAGINATION.pagerow,
        offset: number.selected * PAGINATION.pagerow,
      });
      if (arrData && arrData.errCode === 0) {
        // Sắp xếp dữ liệu theo ngày gần nhất
        const sortedData = arrData.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setdataReceipt(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnClickExport = async () => {
    try {
      let res = await getAllReceipt({
        limit: "",
        offset: "",
        sort: "desc",
        sortBy: "createdAt",
      });
      if (res && res.errCode === 0) {
        await CommonUtils.exportExcel(
          res.data,
          "Danh sách nhập hàng",
          "ListReceipt"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý nhập hàng</h1>
      <div className="card mb-4">
        <div className="card-header flex justify-content-between">
          <Link
            to={"/admin/add-receipt"}
            className="btn btn-primary d-flex align-items-center"
          >
            <i className="bi bi-plus fs-5 me-2"></i> Thêm nhập hàng
          </Link>
          <button
            style={{ float: "right" }}
            onClick={handleOnClickExport}
            className="btn btn-success mb-2"
          >
            Xuất excel <i className="fa-solid fa-file-excel"></i>
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12"></div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-bordered"
              style={{ border: "1" }}
              width="100%"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ngày nhập hàng</th>
                  <th>Tên nhà cung cấp</th>
                  <th>Số điện thoại</th>
                  <th>Tên nhân viên</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dataReceipt &&
                  dataReceipt.length > 0 &&
                  dataReceipt.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {moment
                          .utc(item.createdAt)
                          .local()
                          .format("DD/MM/YYYY HH:mm:ss")}
                      </td>
                      <td>{item.supplierData?.name}</td>
                      <td>{item.supplierData.phonenumber}</td>
                      <td>
                        {item.userData.firstName + " " + item.userData.lastName}
                      </td>
                      <td>
                        <Link to={`/admin/detail-receipt/${item.id}`}>
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
                            className="feather feather-eye icon-xs"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </Link>
                        &nbsp; &nbsp;
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {count > 1 && (
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
};

export default ManageReceipt;
