import React from 'react';
import { useEffect, useState } from 'react';
import { getAllBlog, deleteBlogService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import '../Banner/AddBanner.scss';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';

const ManageBlog = () => {

    const [dataBlog, setdataBlog] = useState([])
    const [imgPreview, setimgPreview] = useState('')
    const [isOpen, setisOpen] = useState(false)
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [keyword, setkeyword] = useState('')
    useEffect(() => {

        loadBlog(keyword)

    }, [])
    let loadBlog = async (keyword) => {
        let arrData = await getAllBlog({
            subjectId: '',
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword: keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataBlog(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }


    let openPreviewImage = (url) => {
        setimgPreview(url);
        setisOpen(true);
    }
    let handleDeleteBlog = async (id) => {
        // Hiển thị hộp thoại xác nhận
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?");
        if (confirmDelete) {
            let response = await deleteBlogService({
                data: { id: id }
            });
            if (response && response.errCode === 0) {
                toast.success("Xóa bài đăng thành công !");
                let arrData = await getAllBlog({
                    subjectId: '',
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    keyword: keyword
                });
                if (arrData && arrData.errCode === 0) {
                    setdataBlog(arrData.data);
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
                }
            } else {
                toast.error("Xóa bài đăng thất bại");
            }
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllBlog({

            subjectId: '',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataBlog(arrData.data)

        }
    }
    let handleSearchBlog = (keyword) => {
        loadBlog(keyword)
        setkeyword(keyword)
    }
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            loadBlog(keyword)
            setkeyword(keyword)
        }
    }
    let handleOnClickExport = async () => {
        let res = await getAllBlog({
            subjectId: '',
            limit: '',
            offset: '',
            keyword: ''
        })
        if (res && res.errCode == 0) {
            res.data.forEach(element => {
                element.image = ""
            })
            await CommonUtils.exportExcel(res.data, "Danh sách bài viết", "ListBlog")
        }

    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý bài đăng</h1>


            <div className="card mb-4">

                <div className="card-header flex justify-content-between">
                    <Link to={'/admin/add-blog'} className="btn btn-primary d-flex align-items-center" ><i className="bi bi-plus fs-5 me-2"></i> Thêm bài đăng</Link>
                    <div className='col-8'>
                        <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                    </div>
                </div>
                <div className="card-body">

                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tiêu đề"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBlog} />
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên bài đăng</th>
                                    <th>Chủ đề</th>
                                    <th>Hình ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataBlog && dataBlog.length > 0 &&
                                    dataBlog.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.title}</td>
                                                <td>{item.subjectData.value}</td>
                                                <td style={{ width: '30%' }} ><div onClick={() => openPreviewImage(item.image)} className="box-img-preview" style={{ backgroundImage: `url(${item.image})`, width: '100%' }}></div></td>
                                                <td style={{ width: '20%' }}>
                                                    <Link to={`/admin/edit-blog/${item.id}`}>
                                                        <svg style={{ color: "black" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit icon-xs"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </Link>
                                                    &nbsp; &nbsp;

                                                    <span onClick={() => handleDeleteBlog(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather text-danger feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>

                                                    </span>


                                                </td>
                                            </tr>
                                        )
                                    })
                                }




                            </tbody>
                        </table>
                    </div>
                </div>
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
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
            {
                isOpen === true &&
                <Lightbox mainSrc={imgPreview}
                    onCloseRequest={() => setisOpen(false)}
                />
            }
        </div >
    )
}
export default ManageBlog;