import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';
const ManageSubject = () => {

    const [dataSubject, setdataSubject] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [keyword, setkeyword] = useState('')
    useEffect(() => {


        fetchData(keyword);


    }, [])
    let fetchData = async (keyword) => {
        let arrData = await getListAllCodeService({

            type: 'SUBJECT',
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword: keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataSubject(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }
    let handleDeleteSubject = async (event, id) => {
        event.preventDefault();
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa chủ đề này?");
        if (confirmDelete) {
            let res = await DeleteAllcodeService(id)
            if (res && res.errCode === 0) {
                toast.success("Xóa chủ đề thành công")
                let arrData = await getListAllCodeService({
                    type: 'SUBJECT',
                    limit: PAGINATION.pagerow,
                    offset: numberPage * PAGINATION.pagerow,
                    keyword: keyword
                })
                if (arrData && arrData.errCode === 0) {
                    setdataSubject(arrData.data)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            } else {
                toast.error("Xóa chủ đề thất bại")
            }
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getListAllCodeService({

            type: 'SUBJECT',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword

        })
        if (arrData && arrData.errCode === 0) {
            setdataSubject(arrData.data)

        }
    }
    let handleSearchSubject = (keyword) => {
        fetchData(keyword)
        setkeyword(keyword)
    }
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchData(keyword)
            setkeyword(keyword)
        }
    }
    let handleOnClickExport = async () => {
        let res = await getListAllCodeService({
            type: 'SUBJECT',
            limit: '',
            offset: '',
            keyword: ''
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách chủ đề", "ListSubject")
        }
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chủ đề</h1>


            <div className="card mb-4">
                <div className="card-header flex justify-content-between">
                    <Link to={'/admin/add-subject'} className="btn btn-primary d-flex align-items-center" ><i className="bi bi-plus fs-5 me-2"></i> Thêm chủ đề</Link>
                    <div className='col-8'>
                        <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                    </div>
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên chủ đề"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchSubject} />
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataSubject && dataSubject.length > 0 &&
                                    dataSubject.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    <Link to={`/admin/edit-Brand/${item.id}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'black' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit icon-xs"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>

                                                    </Link>
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleDeleteSubject(event, item.id)} >                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather text-danger feather-trash-2 icon-xs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </table>
                    </div>
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
    )
}
export default ManageSubject;