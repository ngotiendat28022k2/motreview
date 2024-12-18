import React from "react";
import { useEffect, useState } from "react";
import {
    getAllBanner,
    deleteBannerService,
} from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./AddBanner.scss";
import { PAGINATION } from "../../../utils/constant";
import ReactPaginate from "react-paginate";
import CommonUtils from "../../../utils/CommonUtils";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
} from "react-router-dom";
import FormSearch from "../../../component/Search/FormSearch";

const ManageBanner = () => {
    const [keyword, setkeyword] = useState("");
    const [dataBanner, setdataBanner] = useState([]);
    const [imgPreview, setimgPreview] = useState("");
    const [isOpen, setisOpen] = useState(false);
    const [count, setCount] = useState("");
    const [numberPage, setnumberPage] = useState("");
    useEffect(() => {
        loadBanner(keyword);
    }, []);
    let loadBanner = async (keyword) => {
        let arrData = await getAllBanner({
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword: keyword,
        });
        if (arrData && arrData.errCode === 0) {
            setdataBanner(arrData.data);
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
        }
    };

    let openPreviewImage = (url) => {
        setimgPreview(url);
        setisOpen(true);
    };
    let handleDeleteBanner = async (id) => {
        // Hiển thị hộp thoại xác nhận
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa băng rôn này không?");

        // Nếu người dùng xác nhận, thực hiện xóa băng rôn
        if (isConfirmed) {
            let response = await deleteBannerService({
                data: {
                    id: id,
                },
            });
            if (response && response.errCode === 0) {
                toast.success("Xóa băng rôn thành công!");
                let arrData = await getAllBanner({
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    keyword: keyword,
                });
                if (arrData && arrData.errCode === 0) {
                    setdataBanner(arrData.data);
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
                }
            } else {
                toast.error("Xóa băng rôn thất bại");
            }
        }
    };

    let handleChangePage = async (number) => {
        setnumberPage(number.selected);
        let arrData = await getAllBanner({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword,
        });
        if (arrData && arrData.errCode === 0) {
            setdataBanner(arrData.data);
        }
    };
    let handleSearchBanner = (keyword) => {
        loadBanner(keyword);
        setkeyword(keyword);
    };
    let handleOnchangeSearch = (keyword) => {
        if (keyword === "") {
            loadBanner(keyword);
            setkeyword(keyword);
        }
    };
    let handleOnClickExport = async () => {
        let res = await getAllBanner({
            limit: "",
            offset: "",
            keyword: "",
        });

        if (res && res.errCode == 0) {
            res.data.forEach((element) => {
                element.image = "";
            });

            await CommonUtils.exportExcel(
                res.data,
                "Danh sách băng rôn",
                "ListBanner"
            );
        }
    };
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý băng rôn</h1>

            <div className="card mb-4">
                <div className="card-header flex justify-content-between">
                    <Link to={'/admin/add-banner'} className="btn btn-primary d-flex align-items-center" ><i className="bi bi-plus fs-5 me-2"></i> Thêm băng rôn</Link>
                    <button
                        style={{ float: "right" }}
                        onClick={() => handleOnClickExport()}
                        className="btn btn-success"
                    >
                        Xuất excel <i class="fa-solid fa-file-excel"></i>
                    </button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <FormSearch title={"tên băng rôn"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBanner} />
                        </div>
                        <div className="col-8">

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
                                    {/* <th>Tên băng rôn</th> */}
                                    <th>Hình ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataBanner &&
                                    dataBanner.length > 0 &&
                                    dataBanner.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                {/* <td>{item.name}</td> */}
                                                <td style={{ width: "60%", height: "140px" }}>
                                                    <div
                                                        onClick={() => openPreviewImage(item.image)}
                                                        className="box-img-preview"
                                                        style={{
                                                            backgroundImage: `url(${item.image})`,
                                                            width: "100%",
                                                            height: "140px",
                                                        }}
                                                    ></div>
                                                </td>
                                                <td style={{ width: "20%" }}>
                                                    <Link to={`/admin/edit-banner/${item.id}`}>                                                        <svg style={{ color: "black" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit icon-xs"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </Link>
                                                    &nbsp; &nbsp;
                                                    <span
                                                        onClick={() => handleDeleteBanner(item.id)}
                                                        style={{ color: "#0E6DFE", cursor: "pointer" }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather text-danger feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>

                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
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
            {isOpen === true && (
                <Lightbox
                    mainSrc={imgPreview}
                    onCloseRequest={() => setisOpen(false)}
                />
            )}
        </div>
    );
};
export default ManageBanner;